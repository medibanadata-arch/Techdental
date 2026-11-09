import urllib.request
import re
from bs4 import BeautifulSoup

url = 'https://techdentalcare.com/blog-en/medical/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
    soup = BeautifulSoup(html, 'html.parser')
    
    # Find all article links or headings
    articles = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.startswith('https://techdentalcare.com/') and not any(x in href for x in ['/category/', '/tag/', '/page/', '/blog-en/', '#']):
            articles.append((href, a.get_text(strip=True)))
    
    # Remove duplicates preserving order
    seen = set()
    deduped = []
    for h, t in articles:
        if h not in seen and len(t) > 3:
            seen.add(h)
            deduped.append((h, t))
            
    print(f"Found {len(deduped)} article links on {url}:")
    for h, t in deduped[:25]:
        print(f" - {h} -> {t}")
except Exception as e:
    print("Error:", e)

