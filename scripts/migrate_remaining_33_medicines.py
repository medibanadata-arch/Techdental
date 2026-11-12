import os
import re
import json
import sqlite3
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
from migrator_base import URLS

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def download_file(url, folder='public/uploads/medicines'):
    if not url or url.startswith('data:') or url.startswith('/uploads/'):
        return url
    try:
        parsed = urllib.parse.urlparse(url)
        filename = os.path.basename(parsed.path)
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
        print(f"  [download error] {url}: {e}")
        return url

def fetch_soup(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as res:
            return BeautifulSoup(res.read().decode('utf-8', errors='ignore'), 'html.parser')
    except Exception as e:
        print(f"  [fetch error] {url}: {e}")
        return None

def clean_html(content_elem, folder='public/uploads/medicines'):
    if not content_elem:
        return ""
    soup_entry = BeautifulSoup(str(content_elem), 'html.parser')
    
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

def get_faqs_and_disclaimer(entry):
    faqs = []
    disclaimer = None
    if not entry:
        return faqs, disclaimer
    
    faq_started = False
    curr_q = None
    
    for el in entry.find_all(['h2', 'h3', 'h4', 'p', 'blockquote']):
        txt = el.get_text(strip=True)
        txt_lower = txt.lower()
        
        if any(k in txt_lower for k in ['disclaimer:', 'সতর্কতা:', 'সতর্কবার্তা:', 'দায়মুক্তি:']):
            disclaimer = txt
            continue
            
        if any(k in txt_lower for k in ['frequently asked', 'faq', 'সাধারণ জিজ্ঞাসা', 'প্রশ্নোত্তর', 'সচরাচর জিজ্ঞাসিত', 'সম্পর্কে সচরাচর']):
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
    return faqs, disclaimer

# Load BN urls
with open('scripts/all_crawled_category_urls.json', encoding='utf-8') as f:
    crawled = json.load(f)
bn_urls_all = crawled.get('dental_bn', []) + crawled.get('medical_bn', [])

def find_bn_url_for_slug(slug):
    slug_clean = slug.replace('-en', '').replace('-tablet', '').replace('-capsule', '')
    for u in bn_urls_all:
        u_slug = u.rstrip('/').split('/')[-1]
        if slug in u_slug or slug_clean in u_slug or u_slug in slug:
            return u
    return None

conn = sqlite3.connect('database/database.sqlite')
cursor = conn.cursor()

# Get the remaining items where is_active = 0
cursor.execute("SELECT id, slug, name, name_bn FROM medicines WHERE is_active = 0 ORDER BY id")
remaining_items = cursor.fetchall()
print(f"Total remaining items to migrate: {len(remaining_items)}")

# Build map from URLS
url_map = {}
for u in URLS:
    s = u.rstrip('/').split('/')[-1]
    url_map[s] = u

for idx, item in enumerate(remaining_items):
    mid, slug, old_name, old_name_bn = item
    print(f"\n[{idx+1}/{len(remaining_items)}] Migrating item ID {mid}: {slug}...")
    
    en_url = url_map.get(slug)
    if not en_url:
        # Fallback url guessing
        en_url = f"https://techdentalcare.com/medicine/{slug}/"
        
    bn_url = find_bn_url_for_slug(slug)
    print(f"  EN URL: {en_url}")
    print(f"  BN URL: {bn_url}")
    
    soup_en = fetch_soup(en_url) if en_url else None
    soup_bn = fetch_soup(bn_url) if bn_url else None
    
    entry_en = soup_en.find(class_=lambda c: c and 'elementor-widget-theme-post-content' in c) or soup_en.find('article') if soup_en else None
    entry_bn = soup_bn.find(class_=lambda c: c and 'elementor-widget-theme-post-content' in c) or soup_bn.find('article') if soup_bn else None
    
    faqs_en, disc_en = get_faqs_and_disclaimer(entry_en)
    faqs_bn, disc_bn = get_faqs_and_disclaimer(entry_bn)
    
    h1_en = soup_en.find('h1') if soup_en else None
    title_en = h1_en.get_text(strip=True) if h1_en else old_name
    
    h1_bn = soup_bn.find('h1') if soup_bn else None
    title_bn = h1_bn.get_text(strip=True) if h1_bn else (old_name_bn or old_name)
    
    # Image
    og_en = soup_en.find('meta', property='og:image') if soup_en else None
    img_url_en = og_en['content'] if og_en and og_en.get('content') else None
    local_image = download_file(img_url_en, 'public/uploads/medicines') if img_url_en else f"/uploads/medicines/{slug}.webp"
    
    seo_content_en = clean_html(entry_en, 'public/uploads/medicines') if entry_en else ""
    seo_content_bn = clean_html(entry_bn, 'public/uploads/medicines') if entry_bn else ""
    
    combined_faqs = []
    max_f = max(len(faqs_en), len(faqs_bn))
    for i in range(max_f):
        f_item = {}
        if i < len(faqs_en):
            f_item['q'] = faqs_en[i]['q']
            f_item['a'] = faqs_en[i]['a']
        if i < len(faqs_bn):
            f_item['q_bn'] = faqs_bn[i]['q']
            f_item['a_bn'] = faqs_bn[i]['a']
        combined_faqs.append(f_item)
        
    print(f"  FAQs: {len(combined_faqs)} ({len(faqs_en)} EN, {len(faqs_bn)} BN)")
    
    default_disclaimer = disc_en or "Disclaimer: This is educational information only (updated January 2026). Not a substitute for professional medical advice. Always consult a qualified physician before starting or stopping any medication."
    default_disclaimer_bn = disc_bn or "সতর্কতা: এটি শুধুমাত্র শিক্ষামূলক তথ্য (হালনাগাদ জানুয়ারি ২০২৬)। পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়। কোনো ওষুধ শুরু বা বন্ধ করার আগে সর্বদা একজন নিবন্ধিত চিকিৎসকের পরামর্শ নিন।"
    
    author_obj = {
        "img": "https://ui-avatars.com/api/?name=Dr.+Afsana+Haque+Joty&background=8b1d41&color=fff&size=160",
        "name": "Dr. Afsana Haque Joty",
        "name_bn": "ডা. আফসana হক জ্যোতি",
        "bio": "Dr. Afsana Haque Joty is a Senior Dental Surgeon at Tech Dental with extensive expertise in oral health and clinical care.",
        "bio_bn": "টেক ডেন্টাল মিরপুর শাখার সিনিয়র ডেন্টাল সার্জন, যিনি ৫ বছরেরও বেশি সময় ধরে দন্তচিকিৎসা ও ওরাল সার্জারিতে সেবা দিচ্ছেন।",
        "reviewed_by": "Dr. Afsana Haque Joty (BDS)",
        "reviewed_by_bn": "ডা. আফসানা হক জ্যোতি (বিডিএস)",
        "last_updated": "January 2026",
        "disclaimer": default_disclaimer,
        "disclaimer_bn": default_disclaimer_bn
    }
    
    cursor.execute("""
        UPDATE medicines SET
            name = COALESCE(NULLIF(?, ''), name),
            name_bn = COALESCE(NULLIF(?, ''), name_bn),
            image = ?,
            faqs = ?,
            author = ?,
            seo_content = COALESCE(NULLIF(?, ''), seo_content),
            seo_content_bn = COALESCE(NULLIF(?, ''), seo_content_bn),
            is_active = 1
        WHERE id = ?
    """, (title_en, title_bn, local_image, json.dumps(combined_faqs), json.dumps(author_obj), seo_content_en, seo_content_bn, mid))
    print(f"  Item ID {mid} activated with is_active = 1")

conn.commit()
print("\nALL ITEMS SUCCESSFULLY ACTIVATED AND MIGRATED IN MEDICINES!")

