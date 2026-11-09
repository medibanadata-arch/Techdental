import sqlite3
import json
import urllib.request
import re
from bs4 import BeautifulSoup
from migrator_base import HEADERS
from master_migration_base import clean_html, extract_faqs

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

dental_bn_map = {
    "bad-breath-causes": "https://techdentalcare.com/bn/dentistry/bad-breath-remedies/",
    "gum-cancer-symptoms-causes": "https://techdentalcare.com/bn/dentistry/gum-cancer-symptoms/",
    "wisdom-tooth-pain-relief-tips": "https://techdentalcare.com/bn/dentistry/wisdom-tooth-pain-relief/",
    "toothache-relief": "https://techdentalcare.com/bn/dentistry/toothache-relief-tips/",
    "best-orthodontist-doctor-in-dhaka": "https://techdentalcare.com/bn/physicians/best-orthodontist-doctor-dental-clinic-in-dhaka/",
    "orthodontic-centre": "https://techdentalcare.com/bn/dentistry/orthodontic-centre-tech-dental/"
}

print("Checking and populating BN dental posts...")

for slug, bn_url in dental_bn_map.items():
    row = c.execute("SELECT id, title, title_bn, content_bn FROM posts WHERE slug = ?", (slug,)).fetchone()
    if not row:
        print(f"Post not found for slug: {slug}")
        continue
    post_id, title, title_bn, content_bn = row
    if not content_bn or len(content_bn) < 100:
        print(f"Fetching BN content for {slug} from {bn_url}...")
        try:
            req = urllib.request.Request(bn_url, headers=HEADERS)
            html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            
            h1 = soup.find('h1')
            bn_title = h1.get_text(strip=True) if h1 else title_bn or title
            
            entry = soup.find(class_=lambda cls: cls and any(x in cls for x in ['entry-content', 'post-content'])) or soup.find('article')
            if entry:
                paras = [p.get_text(strip=True) for p in entry.find_all('p') if len(p.get_text(strip=True)) > 20]
                bn_excerpt = paras[0][:160] + "..." if paras else ""
                bn_content = clean_html(entry, 'public/uploads/posts')
                
                faqs = extract_faqs(soup, entry)
                
                c.execute('''
                    UPDATE posts SET
                        title_bn = ?, excerpt_bn = ?, content_bn = ?
                    WHERE id = ?
                ''', (bn_title, bn_excerpt, bn_content, post_id))
                conn.commit()
                print(f"  [OK] Updated post #{post_id} ({slug}) with Bengali content!")
        except Exception as e:
            print(f"  Error fetching {bn_url}: {e}")
    else:
        print(f"Post #{post_id} ({slug}) already has Bengali content.")

print("Done checking dental posts.")

