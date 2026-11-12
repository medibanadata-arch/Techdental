import urllib.request
import os
import re
import json
import sqlite3
from bs4 import BeautifulSoup

os.makedirs('public/uploads/posts', exist_ok=True)

HEADERS = {"User-Agent": "Mozilla/5.0"}

def download_file(url, folder='public/uploads/posts'):
    if not url or url.startswith('data:') or url.startswith('/'):
        return url
    try:
        filename = os.path.basename(urllib.parse.urlparse(url).path)
        if not filename or '.' not in filename:
            filename = f"img_{abs(hash(url))}.webp"
        target_path = os.path.join(folder, filename)
        web_path = '/' + target_path.replace('\\', '/').replace('public/', '')
        
        if os.path.exists(target_path) and os.path.getsize(target_path) > 0:
            return web_path
            
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as res:
            with open(target_path, 'wb') as f:
                f.write(res.read())
        return web_path
    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return url

def fetch_soup(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as res:
        return BeautifulSoup(res.read().decode('utf-8', errors='ignore'), 'html.parser')

def clean_content_and_download_images(entry, folder='public/uploads/posts'):
    if not entry:
        return ""
    # Clone to avoid mutating
    soup_entry = BeautifulSoup(str(entry), 'html.parser')
    for tag in soup_entry.find_all(class_=lambda c: c and any(x in c for x in ['elementor-share-buttons', 'elementor-social-icons', 'post-info', 'author-box', 'comments-area'])):
        tag.decompose()
        
    for img in soup_entry.find_all('img'):
        src = img.get('data-lazy-src') or img.get('data-src') or img.get('src')
        if src and not src.startswith('data:'):
            if src.startswith('/'):
                src = 'https://techdentalcare.com' + src
            local_src = download_file(src, folder)
            img['src'] = local_src
            for attr in ['srcset', 'data-src', 'data-lazy-src', 'data-lazy-srcset', 'sizes']:
                if img.has_attr(attr):
                    del img[attr]
            img['class'] = 'rounded-2xl my-4 mx-auto shadow-sm max-w-full h-auto object-cover'
            img['loading'] = 'lazy'
            
    for tag in soup_entry.find_all(True):
        if tag.has_attr('style'):
            s = tag['style']
            if 'width' in s and 'px' in s:
                del tag['style']
                
    return str(soup_entry)

def extract_faqs_from_entry(entry):
    faqs = []
    if not entry:
        return faqs
    faq_started = False
    curr_q = None
    for el in entry.find_all(['h2', 'h3', 'h4', 'p', 'blockquote']):
        txt = el.get_text(strip=True)
        txt_lower = txt.lower()
        if any(k in txt_lower for k in ['disclaimer:', 'সতর্কতা:', 'সতর্কবার্তা:']):
            break
        if any(k in txt_lower for k in ['frequently asked', 'faq', 'সাধারণ জিজ্ঞাসা', 'প্রশ্নোত্তর', 'সচরাচর জিজ্ঞাসিত']):
            faq_started = True
            continue
        if faq_started:
            if el.name in ['h1', 'h2'] and not any(k in txt_lower for k in ['q:', 'প্রশ্ন', 'faq', '?']):
                break
            is_q = (el.name in ['h3', 'h4'] or '?' in txt or txt.startswith('Q:') or txt.startswith('প্রশ্ন:') or txt.startswith('প্রশ্ন '))
            if is_q:
                curr_q = re.sub(r'^(?:Q\s*:\s*|প্রশ্ন\s*:\s*)', '', txt).strip()
            elif el.name in ['p', 'div'] and curr_q:
                ans = re.sub(r'^(?:A\s*:\s*|Ans\s*:\s*|উত্তর\s*:\s*)', '', txt).strip()
                if ans and len(ans) > 3:
                    faqs.append({'q': curr_q, 'a': ans})
                    curr_q = None
    return faqs

print("Migration module ready.")

pairs = [
    {
        'id': 5,
        'slug': 'best-orthodontist-doctor-in-dhaka',
        'en_url': 'https://techdentalcare.com/dental/best-orthodontist-doctor-in-dhaka/',
        'bn_url': 'https://techdentalcare.com/bn/dentistry/orthodontic-centre-tech-dental/',
        'bn_slug': 'orthodontic-centre-tech-dental'
    },
    {
        'id': 6,
        'slug': 'best-dental-clinic-in-chennai',
        'en_url': 'https://techdentalcare.com/dental/best-dental-clinic-in-chennai/',
        'bn_url': None,
        'bn_slug': None
    },
    {
        'id': 7,
        'slug': 'bad-breath-causes',
        'en_url': 'https://techdentalcare.com/dental/bad-breath-causes/',
        'bn_url': 'https://techdentalcare.com/bn/dentistry/bad-breath-remedies/',
        'bn_slug': 'bad-breath-remedies'
    },
    {
        'id': 8,
        'slug': 'gum-cancer-symptoms-causes',
        'en_url': 'https://techdentalcare.com/dental/gum-cancer-symptoms-causes/',
        'bn_url': 'https://techdentalcare.com/bn/dentistry/gum-cancer-symptoms/',
        'bn_slug': 'gum-cancer-symptoms'
    },
    {
        'id': 9,
        'slug': 'wisdom-tooth-pain-relief-tips',
        'en_url': 'https://techdentalcare.com/dental/wisdom-tooth-pain-relief-tips/',
        'bn_url': 'https://techdentalcare.com/bn/dentistry/wisdom-tooth-pain-relief/',
        'bn_slug': 'wisdom-tooth-pain-relief'
    },
    {
        'id': 10,
        'slug': 'toothache-relief',
        'en_url': 'https://techdentalcare.com/dental/toothache-relief/',
        'bn_url': 'https://techdentalcare.com/bn/dentistry/toothache-relief-tips/',
        'bn_slug': 'toothache-relief-tips'
    },
    {
        'id': 99,
        'slug': 'tooth-cavity-home-remedies',
        'en_url': None,
        'bn_url': 'https://techdentalcare.com/bn/dentistry/tooth-cavity-home-remedies/',
        'bn_slug': 'tooth-cavity-home-remedies'
    }
]

conn = sqlite3.connect('database/database.sqlite')
cursor = conn.cursor()

# Set all posts in posts table to category 'Blog' or their own non-dental category so ONLY the dental ones remain Dental!
cursor.execute("UPDATE posts SET category = 'Other' WHERE category = 'Dental' OR category_id = 7")
conn.commit()

for p in pairs:
    print(f"\nProcessing dental post: {p['slug']}...")
    en_soup = fetch_soup(p['en_url']) if p['en_url'] else None
    bn_soup = fetch_soup(p['bn_url']) if p['bn_url'] else None
    
    title_en = ""
    excerpt_en = ""
    content_en = ""
    img_en = ""
    faqs_en = []
    
    if en_soup:
        h1 = en_soup.find('h1')
        title_en = h1.get_text(strip=True) if h1 else ""
        og_img = en_soup.find('meta', property='og:image')
        if og_img and og_img.get('content'):
            img_en = download_file(og_img['content'], 'public/uploads/posts')
        entry = en_soup.find(class_=lambda c: c and 'elementor-widget-theme-post-content' in c) or en_soup.find('article')
        faqs_en = extract_faqs_from_entry(entry)
        content_en = clean_content_and_download_images(entry)
        p_tag = entry.find('p') if entry else None
        excerpt_en = p_tag.get_text(strip=True)[:180] + "..." if p_tag else ""
        
    title_bn = ""
    excerpt_bn = ""
    content_bn = ""
    img_bn = ""
    faqs_bn = []
    
    if bn_soup:
        h1 = bn_soup.find('h1')
        title_bn = h1.get_text(strip=True) if h1 else ""
        og_img = bn_soup.find('meta', property='og:image')
        if og_img and og_img.get('content'):
            img_bn = download_file(og_img['content'], 'public/uploads/posts')
        entry = bn_soup.find(class_=lambda c: c and 'elementor-widget-theme-post-content' in c) or bn_soup.find('article')
        faqs_bn = extract_faqs_from_entry(entry)
        content_bn = clean_content_and_download_images(entry)
        p_tag = entry.find('p') if entry else None
        excerpt_bn = p_tag.get_text(strip=True)[:180] + "..." if p_tag else ""
        
    # Combine FAQs
    combined_faqs = []
    max_f = max(len(faqs_en), len(faqs_bn))
    for i in range(max_f):
        item = {}
        if i < len(faqs_en):
            item['q'] = faqs_en[i]['q']
            item['a'] = faqs_en[i]['a']
        if i < len(faqs_bn):
            item['q_bn'] = faqs_bn[i]['q']
            item['a_bn'] = faqs_bn[i]['a']
        combined_faqs.append(item)
        
    featured_img = img_en or img_bn or "/uploads/posts/dental-default.webp"
    
    # Check if post exists
    cursor.execute("SELECT id FROM posts WHERE slug = ? OR id = ?", (p['slug'], p['id']))
    row = cursor.fetchone()
    
    tags = json.dumps([p['bn_slug']] if p['bn_slug'] else [])
    
    if row:
        target_id = row[0]
        cursor.execute("""
            UPDATE posts SET
                title = COALESCE(NULLIF(?, ''), title),
                title_bn = COALESCE(NULLIF(?, ''), title_bn),
                excerpt = COALESCE(NULLIF(?, ''), excerpt),
                excerpt_bn = COALESCE(NULLIF(?, ''), excerpt_bn),
                content = COALESCE(NULLIF(?, ''), content),
                content_bn = COALESCE(NULLIF(?, ''), content_bn),
                img = COALESCE(NULLIF(?, ''), img),
                category = 'Dental',
                category_id = 7,
                category_bn = 'ডেন্টাল',
                status = 'published',
                faqs = ?,
                tags = ?
            WHERE id = ?
        """, (title_en, title_bn, excerpt_en, excerpt_bn, content_en, content_bn, featured_img, json.dumps(combined_faqs), tags, target_id))
        print(f"Updated post ID {target_id}: {p['slug']} (Dental)")
    else:
        cursor.execute("""
            INSERT INTO posts (
                id, slug, title, title_bn, excerpt, excerpt_bn, content, content_bn,
                img, category, category_id, category_bn, status, faqs, tags, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Dental', 7, 'ডেন্টাল', 'published', ?, ?, datetime('now'))
        """, (p['id'], p['slug'], title_en, title_bn, excerpt_en, excerpt_bn, content_en, content_bn, featured_img, json.dumps(combined_faqs), tags))
        print(f"Inserted post ID {p['id']}: {p['slug']} (Dental)")
        
conn.commit()
print("All dental posts migrated and updated successfully!")
