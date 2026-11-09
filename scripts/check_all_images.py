import urllib.request
import urllib.parse
import os
import re
from bs4 import BeautifulSoup
from migrator_base import URLS, HEADERS

os.makedirs('public/uploads/medicines', exist_ok=True)

print(f"Checking images for all {len(URLS)} URLs...")

results = []

for idx, url in enumerate(URLS):
    slug = url.rstrip('/').split('/')[-1]
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'html.parser')
        
        # 1. og:image
        og = soup.find('meta', attrs={'property': 'og:image'})
        img_src = og.get('content') if og else None
        
        # 2. if not og:image, look for wp-post-image
        if not img_src or 'lhfgujsfdhg.png' in img_src or 'logo' in img_src.lower():
            post_img = soup.find('img', class_=lambda c: c and 'wp-post-image' in c)
            if post_img:
                img_src = post_img.get('data-src') or post_img.get('src')
                
        # 3. if still not, look for first content img that is not logo or badge
        if not img_src or 'lhfgujsfdhg.png' in img_src or 'logo' in img_src.lower():
            entry = soup.find(class_=lambda c: c and any(x in c for x in ['entry-content', 'post-content']))
            if entry:
                for img in entry.find_all('img'):
                    src = img.get('data-lazy-src') or img.get('data-src') or img.get('src')
                    if src and not src.startswith('data:') and not any(x in src for x in ['logo', 'icon', 'lhfgujsfdhg', 'advance-vt-1002']):
                        img_src = src
                        break
                        
        print(f"[{idx+1}/{len(URLS)}] {slug} -> {img_src}")
        results.append({'slug': slug, 'url': url, 'img_src': img_src})
    except Exception as e:
        print(f"[{idx+1}/{len(URLS)}] ERROR on {url}: {e}")
        results.append({'slug': slug, 'url': url, 'img_src': None, 'error': str(e)})

import json
with open('scripts/all_82_images_check.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("\nDone checking all 82 URLs.")
