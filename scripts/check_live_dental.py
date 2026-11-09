import urllib.request
from bs4 import BeautifulSoup
import json

def fetch_category(url):
    print("Fetching:", url)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    
    # Let's find all article/post links
    posts = []
    # typically inside articles or h2/h3 links
    for a in soup.find_all('a', href=True):
        href = a['href']
        text = a.get_text(strip=True)
        # Check if it looks like a dental blog post URL
        if ('techdentalcare.com/dental/' in href or 'techdentalcare.com/bn/dentistry/' in href or 'techdentalcare.com/blog' in href or 'techdentalcare.com/bn/blog' in href):
            if href not in [url, url + '/', 'https://techdentalcare.com/blog-en/dental/', 'https://techdentalcare.com/bn/blog/dental/']:
                # Find image if any
                img = a.find('img')
                img_src = img['src'] if img and img.get('src') else None
                posts.append({'href': href, 'title': text, 'img': img_src})
    return posts

dental_en = fetch_category("https://techdentalcare.com/blog-en/dental/")
dental_bn = fetch_category("https://techdentalcare.com/bn/blog/dental/")

print("\n--- ENGLISH DENTAL POSTS FOUND ---")
seen_en = set()
for p in dental_en:
    if p['href'] not in seen_en:
        print(p['href'], "-->", p['title'][:40])
        seen_en.add(p['href'])

print("\n--- BANGLA DENTAL POSTS FOUND ---")
seen_bn = set()
for p in dental_bn:
    if p['href'] not in seen_bn:
        print(p['href'], "-->", p['title'][:40])
        seen_bn.add(p['href'])
