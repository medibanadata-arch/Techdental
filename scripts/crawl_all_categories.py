import urllib.request
from bs4 import BeautifulSoup
import re
import json

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def crawl_category(base_url, max_pages=15):
    all_post_links = []
    for page in range(1, max_pages + 1):
        url = base_url if page == 1 else f"{base_url.rstrip('/')}/page/{page}/"
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find all article / post links
            links = []
            for a in soup.find_all('a', href=True):
                href = a['href']
                if not href.startswith('http'):
                    continue
                # Exclude category/tag/page/home/author/feed
                if any(x in href for x in ['/page/', '/category/', '/tag/', '/author/', '/feed/', 'facebook.com', 'instagram.com', 'whatsapp.com', 'twitter.com', 'linkedin.com', 'youtube.com']):
                    continue
                if href.rstrip('/') in [base_url.rstrip('/'), 'https://techdentalcare.com', 'https://techdentalcare.com/bn', 'https://techdentalcare.com/blog-en']:
                    continue
                # Must be a dental or medicine or medication post
                if any(x in href for x in ['/dental/', '/medicine/', '/medication/', '/dentistry/', '/physician/', '/physicians/', '/update/']):
                    links.append(href.rstrip('/') + '/')
            
            unique_links = list(dict.fromkeys(links))
            print(f"[{base_url}] Page {page}: found {len(unique_links)} post links")
            if not unique_links:
                break
                
            new_links = [l for l in unique_links if l not in all_post_links]
            if not new_links:
                break
            all_post_links.extend(new_links)
            
            # Check if there is next page
            pagination = soup.find(class_=lambda c: c and any(x in c for x in ['pagination', 'nav-links', 'page-numbers']))
            if not pagination or (f"/page/{page+1}/" not in str(pagination) and f"/{page+1}/" not in str(pagination)):
                # If page 1, check if next page exists by probing page 2
                pass
        except Exception as e:
            # print(f"Stopped at page {page}: {e}")
            break
            
    print(f"Total crawled from {base_url}: {len(all_post_links)}")
    return all_post_links

results = {
    'dental_en': crawl_category('https://techdentalcare.com/blog-en/dental/'),
    'dental_bn': crawl_category('https://techdentalcare.com/bn/blog/dental/'),
    'medical_en': crawl_category('https://techdentalcare.com/blog-en/medical/'),
    'medical_bn': crawl_category('https://techdentalcare.com/bn/blog/medical/'),
}

with open('scripts/all_crawled_category_urls.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)

print("\nFinished crawling all 4 categories!")
for k, v in results.items():
    print(f"  {k}: {len(v)} URLs")

