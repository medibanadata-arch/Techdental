import os
import re
import json
import time
import sqlite3
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

from migrator_base import URLS, HEADERS

os.makedirs('public/uploads/medicines', exist_ok=True)
os.makedirs('public/uploads/posts', exist_ok=True)

conn = sqlite3.connect('database/database.sqlite')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Load BN crawled URLs from bn_links.json
with open('scripts/bn_links.json', encoding='utf-8') as f:
    bn_manifest = json.load(f)

bn_medical_urls = bn_manifest.get('medical', [])
bn_dental_urls = bn_manifest.get('dental', [])

def download_file(src_url, folder='public/uploads/medicines'):
    if not src_url or src_url.startswith('data:'):
        return None
    try:
        parsed = urllib.parse.urlparse(src_url)
        base_name = os.path.basename(parsed.path)
        base_name = re.sub(r'-\d+x\d+(\.[a-zA-Z0-9]+)$', r'\1', base_name)
        if not base_name or '.' not in base_name:
            base_name = f"med_{int(time.time()*1000)}.webp"
        
        target_path = os.path.join(folder, base_name)
        # Web path must NOT include "public/"
        web_path = '/' + target_path.replace('public/', '').replace('public\\', '').replace('\\', '/')
        if not web_path.startswith('/'):
            web_path = '/' + web_path
            
        if os.path.exists(target_path) and os.path.getsize(target_path) > 500:
            return web_path
            
        req = urllib.request.Request(src_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as res:
            data = res.read()
            if len(data) > 500:
                with open(target_path, 'wb') as f:
                    f.write(data)
                return web_path
    except Exception as e:
        print(f"  [download_file error] {src_url}: {e}")
    return None

def fetch_soup(url, retries=2):
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as res:
                return BeautifulSoup(res.read().decode('utf-8', errors='ignore'), 'html.parser')
        except Exception as e:
            if i == retries - 1:
                print(f"  [fetch error] {url}: {e}")
            time.sleep(1)
    return None

def find_best_image(soup):
    og = soup.find('meta', attrs={'property': 'og:image'})
    if og and og.get('content') and not any(x in og.get('content') for x in ['lhfgujsfdhg', 'logo']):
        return og.get('content')
        
    post_img = soup.find('img', class_=lambda c: c and 'wp-post-image' in c)
    if post_img:
        src = post_img.get('data-src') or post_img.get('src')
        if src and not src.startswith('data:'):
            return src
            
    entry = soup.find(class_=lambda c: c and any(x in c for x in ['entry-content', 'post-content']))
    if entry:
        for img in entry.find_all('img'):
            src = img.get('data-lazy-src') or img.get('data-src') or img.get('src')
            if src and not src.startswith('data:') and not any(x in src for x in ['logo', 'icon', 'lhfgujsfdhg', 'advance-vt-1002']):
                return src
    return None

def clean_html(content_elem, folder='public/uploads/medicines'):
    if not content_elem:
        return ""
    # Remove junk
    for tag in content_elem.find_all(class_=lambda c: c and any(x in c for x in ['elementor-share-buttons', 'elementor-social-icons', 'post-info', 'author-box', 'comments-area'])):
        tag.decompose()
        
    # Remove FAQ heading & items to keep FAQs exclusive
    faq_heading = None
    for h in content_elem.find_all(['h2', 'h3']):
        txt = h.get_text().lower()
        if 'faq' in txt or 'frequently asked' in txt or 'সাধারণ জিজ্ঞাসা' in txt or 'প্রশ্নোত্তর' in txt:
            faq_heading = h
            break
    if faq_heading:
        curr = faq_heading
        to_del = [curr]
        while curr.next_sibling:
            curr = curr.next_sibling
            if curr.name in ['h1', 'h2'] and not any(k in curr.get_text().lower() for k in ['faq', 'frequently', 'branch', 'opening', 'services']):
                break
            to_del.append(curr)
        for el in to_del:
            if hasattr(el, 'decompose'):
                el.decompose()
                
    # Remove branches / hours footers
    for h in content_elem.find_all(['h2', 'h3']):
        txt = h.get_text().lower().strip()
        if any(w in txt for w in ['our branch', 'popular services', 'opening hours', 'tech dental clinics']):
            curr = h
            to_del = [curr]
            while curr.next_sibling:
                curr = curr.next_sibling
                to_del.append(curr)
            for el in to_del:
                if hasattr(el, 'decompose'):
                    el.decompose()
            break
            
    # Process images inside content
    for img in content_elem.find_all('img'):
        src = img.get('data-lazy-src') or img.get('data-src') or img.get('src')
        if src and not src.startswith('data:'):
            if src.startswith('/'):
                src = 'https://techdentalcare.com' + src
            local_src = download_file(src, folder)
            if local_src:
                img['src'] = local_src
            if img.has_attr('srcset'):
                del img['srcset']
            if img.has_attr('data-src'):
                del img['data-src']
            if img.has_attr('data-lazy-src'):
                del img['data-lazy-src']
            img['class'] = 'rounded-2xl my-4 mx-auto shadow-sm max-w-full h-auto object-cover'
            img['loading'] = 'lazy'
            
    # Remove style fixed px widths
    for tag in content_elem.find_all(True):
        if tag.has_attr('style'):
            s = tag['style']
            if 'width' in s and 'px' in s:
                del tag['style']
                
    return str(content_elem)

def extract_faqs(soup, entry):
    faqs = []
    # 1. Look for schema FAQ
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            data = json.loads(script.string or '')
            items = []
            if isinstance(data, dict):
                if data.get('@type') == 'FAQPage':
                    items = data.get('mainEntity', [])
                elif '@graph' in data:
                    for g in data['@graph']:
                        if g.get('@type') == 'FAQPage':
                            items = g.get('mainEntity', [])
            for item in items:
                q = item.get('name')
                a = item.get('acceptedAnswer', {}).get('text')
                if q and a:
                    faqs.append({'q': re.sub(r'<[^>]+>', '', q).strip(), 'a': re.sub(r'<[^>]+>', '', a).strip()})
        except:
            pass
    if faqs:
        return faqs
        
    # 2. Extract from HTML h3/p or accordion
    if entry:
        faq_started = False
        curr_q = None
        for el in entry.find_all(['h2', 'h3', 'h4', 'p']):
            txt = el.get_text(strip=True)
            if any(k in txt.lower() for k in ['frequently asked', 'faq', 'সাধারণ জিজ্ঞাসা']):
                faq_started = True
                continue
            if faq_started:
                if el.name in ['h2', 'h3', 'h4'] or '?' in txt:
                    if curr_q:
                        curr_q = None
                    curr_q = txt
                elif el.name == 'p' and curr_q:
                    faqs.append({'q': curr_q, 'a': txt})
                    curr_q = None
    return faqs

print("Master migration script ready to process all 82 URLs into medicines table...")

