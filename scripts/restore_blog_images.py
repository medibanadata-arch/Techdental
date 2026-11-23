"""
Restore the inline images that the old WordPress site had inside blog articles.

The Laravel/React import kept the article text but dropped most <img> tags from
`posts.content` / `posts.content_bn`. This script reads the original WordPress
article for each legacy blog URL, downloads the full-size image (not the 300px
WordPress thumbnail), converts it to a capped-width WebP under
public/uploads/posts, and inserts a <figure> where the source article had it.

WordPress blocks Python's HTTP client behind Cloudflare, so the actual network
calls are delegated to scripts/wp-fetch.mjs (Node's fetch is accepted).

Usage:
    python scripts/restore_blog_images.py --dry-run
    python scripts/restore_blog_images.py
    python scripts/restore_blog_images.py --only /bn/dentistry/medication-to-reduce-swollen-gums-and-pain/
"""

import argparse
import hashlib
import html
import io
import json
import os
import re
import sqlite3
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
from difflib import SequenceMatcher
from pathlib import Path

from bs4 import BeautifulSoup
from PIL import Image

BASE = 'http://127.0.0.1:4322'
ROOT = Path(__file__).resolve().parent.parent
UPLOAD_DIR = ROOT / 'public' / 'uploads' / 'posts'
DB_PATH = ROOT / 'database' / 'database.sqlite'
NODE_HELPER = ROOT / 'scripts' / 'wp-fetch.mjs'
CACHE_DIR = Path(os.environ.get('WP_CACHE_DIR') or (Path(tempfile.gettempdir()) / 'opencode'))
IMAGE_CACHE_DIR = CACHE_DIR / 'wp-images'
MAX_WIDTH = 1600
QUALITY = 82

# Legacy blog URLs whose current Astro page renders Blog/PublicSingle but whose
# article body no longer contains the old-site images.
LEGACY_BLOG_PATHS = [
    '/dental/best-orthodontist-doctor-in-dhaka/',
    '/bn/physicians/best-orthodontist-doctor-dental-clinic-in-dhaka/',
    '/dental/best-dental-clinic-in-chennai/',
    '/physician/best-dermatologist-dhaka/',
    '/bn/physicians/best-dentist-chittagong-bd/',
    '/physician/best-dentist-chittagong/',
    '/bn/dentistry/bad-breath-remedies/',
    '/dental/gum-cancer-symptoms-causes/',
    '/bn/dentistry/gum-cancer-symptoms/',
    '/bn/dentistry/wisdom-tooth-pain-relief/',
    '/bn/dentistry/toothache-relief-tips/',
    '/bn/dentistry/tooth-cavity-home-remedies/',
    '/bn/wellness/vitamin-deficiency-swollen-gums-solutions/',
    '/dental/dental-implants-near-me/',
    '/dental/dental-implants-bangladesh/',
    '/bn/dentistry/medication-to-reduce-swollen-gums-and-pain/',
    '/bn/dentistry/teeth-pain-solution-guide/',
]


def local_get(url, timeout=40):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=timeout) as res:
        return res.read()


def run_node(*args):
    result = subprocess.run(
        ['node', str(NODE_HELPER), *map(str, args)],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding='utf-8',
    )
    if result.returncode != 0:
        raise RuntimeError(f'wp-fetch.mjs failed: {result.stderr or result.stdout}')
    return result.stdout


def ensure_wp_cache():
    posts = CACHE_DIR / 'posts.json'
    pages = CACHE_DIR / 'pages.json'
    legacy_posts = CACHE_DIR / 'wp-posts.json'
    legacy_pages = CACHE_DIR / 'wp-pages.json'
    if not posts.exists() and legacy_posts.exists():
        posts = legacy_posts
    if not pages.exists() and legacy_pages.exists():
        pages = legacy_pages
    if posts.exists() and pages.exists():
        return posts, pages
    print('Fetching WordPress posts/pages ...')
    run_node('docs', CACHE_DIR)
    return CACHE_DIR / 'posts.json', CACHE_DIR / 'pages.json'


def wp_by_path():
    posts_file, pages_file = ensure_wp_cache()
    docs = json.loads(posts_file.read_text(encoding='utf-8')) + json.loads(
        pages_file.read_text(encoding='utf-8')
    )
    by_path = {}
    for doc in docs:
        path = urllib.parse.urlparse(doc['link']).path
        by_path[path] = doc
        by_path[path.rstrip('/')] = doc
    return by_path


def normalise(text):
    text = html.unescape(text or '')
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[\u0964?,;:!.\\"\'“”‘’\-–—()\[\]]', '', text)
    return text.strip().lower()


def decode_astro(value):
    if isinstance(value, list) and len(value) == 2 and isinstance(value[0], (int, float)):
        return decode_astro(value[1])
    if isinstance(value, list):
        return [decode_astro(item) for item in value]
    if isinstance(value, dict):
        return {key: decode_astro(item) for key, item in value.items()}
    return value


def astro_page(path):
    markup = local_get(BASE + path).decode('utf-8', 'ignore')
    match = re.search(r'<astro-island[^>]*props="([^"]*)"', markup)
    if not match:
        return None
    page = decode_astro(json.loads(html.unescape(match.group(1)))).get('page')
    if not page:
        return None
    return {
        'post': page['props'].get('post'),
        'is_bn': bool(page['props'].get('is_bn')),
    }


def extract_images(wp_html):
    """Return content images in document order with alt/caption and anchor text."""
    soup = BeautifulSoup(wp_html or '', 'html.parser')
    images = []
    seen = set()

    for img in soup.find_all('img'):
        src = (img.get('src') or '').strip()
        if not src or src.startswith('data:') or src in seen:
            continue
        seen.add(src)

        figure = img.find_parent('figure')
        paragraph = img.find_parent('p')
        if figure is not None:
            container = figure
            caption_tag = figure.find('figcaption')
            caption = caption_tag.get_text(' ', strip=True) if caption_tag else ''
        elif paragraph is not None:
            container = paragraph
            caption = ''
        else:
            container = img
            caption = ''

        previous = container.find_previous(['h2', 'h3', 'p', 'li', 'td'])
        anchor = normalise(previous.get_text(' ', strip=True))[:60] if previous else ''
        images.append({
            'src': src,
            'srcset': img.get('srcset') or '',
            'alt': (img.get('alt') or '').strip(),
            'caption': caption.strip(),
            'anchor': anchor,
        })

    return images


def strip_size_suffix(name):
    return re.sub(r'-\d+x\d+(\.\w+)$', r'\1', name)


def candidate_sources(image):
    src = image['src']
    candidates = [strip_size_suffix(src)]
    if '-scaled' in src:
        candidates.append(strip_size_suffix(src).replace('-scaled', ''))
    entries = []
    for part in (image.get('srcset') or '').split(','):
        part = part.strip()
        if not part:
            continue
        bits = part.split()
        width = 0
        if len(bits) > 1 and bits[1].endswith('w'):
            try:
                width = int(bits[1][:-1])
            except ValueError:
                width = 0
        entries.append((width, bits[0]))
    for _width, url in sorted(entries, reverse=True):
        candidates.append(url)
    candidates.append(src)
    seen, ordered = set(), []
    for url in candidates:
        if url not in seen:
            seen.add(url)
            ordered.append(url)
    return ordered


def source_key(url):
    return hashlib.sha1(url.encode('utf-8')).hexdigest()[:16]


def download_images(sources):
    """Download candidate lists through Node and return {key: result}."""
    if not sources:
        return {}
    manifest = [
        {'key': source_key(src), 'candidates': candidates}
        for src, candidates in sources.items()
    ]
    cache_file = IMAGE_CACHE_DIR / 'manifest.json'
    IMAGE_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_file.write_text(json.dumps(manifest), encoding='utf-8')
    output = run_node('images', cache_file, IMAGE_CACHE_DIR)
    return json.loads(output)


def local_name(used_url):
    base = urllib.parse.unquote(urllib.parse.urlparse(used_url).path.rsplit('/', 1)[-1])
    base = strip_size_suffix(base)
    base = re.sub(r'\.[A-Za-z0-9]+$', '', base)
    slug = re.sub(r'[^A-Za-z0-9._-]+', '-', base).strip('-._')
    if len(re.sub(r'[^A-Za-z0-9]', '', slug)) < 4:
        slug = 'wp-' + source_key(used_url)
    return slug[:90] + '.webp'


def save_webp(data_path, target):
    image = Image.open(data_path)
    if image.mode not in ('RGB', 'RGBA'):
        image = image.convert('RGBA' if 'A' in image.getbands() else 'RGB')
    if image.width > MAX_WIDTH:
        ratio = MAX_WIDTH / image.width
        image = image.resize((MAX_WIDTH, max(1, round(image.height * ratio))), Image.LANCZOS)
    image.save(target, 'WEBP', quality=QUALITY, method=6)
    return image.width, image.height


def figure_for(soup, web_path, alt, caption):
    figure = soup.new_tag('figure')
    img = soup.new_tag('img')
    img['src'] = web_path
    img['alt'] = alt or ''
    img['loading'] = 'lazy'
    img['decoding'] = 'async'
    figure.append(img)
    if caption:
        figcaption = soup.new_tag('figcaption')
        figcaption.string = caption
        figure.append(figcaption)
    return figure


def existing_names(content_html):
    soup = BeautifulSoup(content_html or '', 'html.parser')
    names = set()
    for img in soup.find_all('img'):
        src = img.get('src') or ''
        names.add(urllib.parse.unquote(src.rsplit('/', 1)[-1]).lower())
    return names


def match_anchor(blocks, anchor, cursor):
    """Find the best block at or after `cursor`; return (index, ratio)."""
    best_ratio, best_index = 0.0, None
    for index in range(cursor, len(blocks)):
        text = normalise(blocks[index].get_text(' ', strip=True))
        if not text:
            continue
        if anchor in text:
            ratio = 1.0
        else:
            ratio = SequenceMatcher(None, anchor, text[: len(anchor) + 20]).ratio()
        if ratio > best_ratio + 0.02:
            best_ratio, best_index = ratio, index
    return best_index, best_ratio


def insert_images(content_html, inserts):
    """Insert `<figure>` blocks into an article body, keeping source order.

    Returns (html, placed, skipped). Images whose old-site anchor no longer
    exists in the article (a rewritten article) are skipped rather than moved
    to a random position.
    """
    soup = BeautifulSoup(content_html or '', 'html.parser')
    container = soup
    root_children = [tag for tag in soup.children if getattr(tag, 'name', None)]
    if len(root_children) == 1 and root_children[0].name == 'div':
        container = root_children[0]
    blocks = [tag for tag in container.children if getattr(tag, 'name', None)]

    targets = []
    cursor = 0
    for insertion in inserts:
        anchor = insertion['anchor']
        if not anchor:
            targets.append(None)  # adjacent image: follow the previous one
            continue
        best_index, best_ratio = match_anchor(blocks, anchor, cursor)
        if best_ratio >= 0.72:
            targets.append(best_index)
            cursor = best_index
        else:
            targets.append('skip')

    last_figure = None
    last_index = None
    placed = 0
    skipped = []
    for insertion, target_index in zip(inserts, targets):
        if target_index == 'skip':
            skipped.append(insertion)
            continue
        figure = figure_for(soup, insertion['web_path'], insertion['alt'], insertion['caption'])
        if target_index is None:
            if last_figure is None:
                skipped.append(insertion)
                continue
            last_figure.insert_after(figure)
        elif last_figure is not None and last_index == target_index:
            last_figure.insert_after(figure)
        else:
            blocks[target_index].insert_after(figure)
        last_figure = figure
        last_index = target_index
        placed += 1

    return str(container), placed, skipped


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--only', default=None)
    args = parser.parse_args()

    if not DB_PATH.exists():
        sys.exit(f'Database not found: {DB_PATH}')
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    print('Loading WordPress content ...')
    wp = wp_by_path()
    print(f'  {len(set(id(d) for d in wp.values()))} old documents available')

    paths = LEGACY_BLOG_PATHS
    if args.only:
        paths = [path for path in paths if path.rstrip('/') == args.only.rstrip('/')]

    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    cursor = connection.cursor()
    targets = []

    for path in paths:
        wp_doc = wp.get(path) or wp.get(path.rstrip('/'))
        if not wp_doc:
            print(f'SKIP {path}: no WordPress document')
            continue
        page = astro_page(path)
        if not page or not page['post']:
            print(f'SKIP {path}: no Astro blog post found')
            continue

        post = page['post']
        field = 'content_bn' if page['is_bn'] else 'content'
        row = cursor.execute(f'SELECT id, {field} AS body FROM posts WHERE id = ?', (post['id'],)).fetchone()
        if row is None:
            print(f'SKIP {path}: post {post["id"]} not in database')
            continue

        body = row['body'] or ''
        images = extract_images(wp_doc['content']['rendered'])
        if not images:
            print(f'SKIP {path}: old article has no images')
            continue

        present = existing_names(body)
        wanted = []
        for image in images:
            source_name = urllib.parse.unquote(
                urllib.parse.urlparse(image['src']).path.rsplit('/', 1)[-1]
            ).lower()
            if source_name in present:
                continue
            wanted.append(image)
            present.add(source_name)
        if wanted:
            targets.append({'path': path, 'post': post, 'field': field, 'body': body, 'images': wanted})

    sources = {}
    for target in targets:
        for image in target['images']:
            if image['src'] not in sources:
                sources[image['src']] = candidate_sources(image)

    print(f'Downloading {len(sources)} source image(s) ...')
    downloads = download_images(sources)

    backups = {}
    used_names = {}
    for target in targets:
        post, field, body = target['post'], target['field'], target['body']
        inserts = []
        for image in target['images']:
            result = downloads.get(source_key(image['src']))
            if not result or result.get('error'):
                print(f'  ! could not download {image["src"]}')
                continue
            name = local_name(result['url'])
            key = name.lower()
            if key in used_names and used_names[key] != result['url']:
                stem, ext = name.rsplit('.', 1)
                name = f'{stem}-{source_key(result["url"])[:6]}.{ext}'
                key = name.lower()
            used_names[key] = result['url']
            inserts.append({
                'web_path': f'/uploads/posts/{name}',
                'alt': image['alt'],
                'caption': image['caption'],
                'anchor': image['anchor'],
                'name': name,
                'result': result,
            })

        if not inserts:
            print(f'OK   {target["path"]}: nothing new to insert')
            continue

        updated, placed, skipped = insert_images(body, inserts)
        skipped_ids = {id(item) for item in skipped}
        if args.dry_run:
            for item in inserts:
                note = '' if id(item) not in skipped_ids else '  [SKIP: anchor not in current article]'
                print(
                    f'  [dry] post {post["id"]} {field}: {item["name"]} <- '
                    f'{item["result"]["url"]} ({item["result"]["bytes"]} bytes){note}'
                )
            print(
                f'  [dry] would insert {placed} of {len(inserts)} image(s) '
                f'into post {post["id"]}.{field}'
            )
            continue

        for item in inserts:
            if id(item) in skipped_ids:
                continue
            width, height = save_webp(item['result']['file'], UPLOAD_DIR / item['name'])
            print(f'  post {post["id"]} {field}: {item["name"]} ({width}x{height})')

        if not placed:
            print(f'SKIP {target["path"]}: old image anchors do not match the current article')
            continue

        backups.setdefault(str(post['id']), {})[field] = body
        cursor.execute(f'UPDATE posts SET {field} = ? WHERE id = ?', (updated, post['id']))
        connection.commit()
        print(f'OK   {target["path"]}: inserted {placed} image(s) into post {post["id"]}.{field}')
        if len(skipped):
            print(f'     {len(skipped)} image(s) skipped: anchor text not found in the current article')

    if backups and not args.dry_run:
        backup_path = ROOT / 'scripts' / 'blog_image_backup.json'
        existing = {}
        if backup_path.exists():
            existing = json.loads(backup_path.read_text(encoding='utf-8'))
        for pid, fields in backups.items():
            existing.setdefault(pid, {}).update(fields)
        backup_path.write_text(json.dumps(existing, ensure_ascii=False, indent=1), encoding='utf-8')
        print(f'Backed up previous article HTML to {backup_path.relative_to(ROOT)}')

    connection.close()


if __name__ == '__main__':
    main()
