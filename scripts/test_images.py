import urllib.request
from bs4 import BeautifulSoup

urls = [
    "https://techdentalcare.com/medicine/xyril-25-tablet/",
    "https://techdentalcare.com/medicine/naproxen-500/",
    "https://techdentalcare.com/medicine/napa-500mg/",
    "https://techdentalcare.com/medicine/cef-3-capsule-suspension/",
    "https://techdentalcare.com/medicine/napa-extra/",
    "https://techdentalcare.com/medicine/alatrol-10/"
]

headers = {'User-Agent': 'Mozilla/5.0'}
for url in urls:
    req = urllib.request.Request(url, headers=headers)
    html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
    soup = BeautifulSoup(html, 'html.parser')
    
    og = soup.find('meta', attrs={'property': 'og:image'})
    og_val = og.get('content') if og else None
    
    imgs = [img.get('src') or img.get('data-src') or img.get('data-lazy-src') for img in soup.find_all('img')]
    imgs = [i for i in imgs if i and not i.startswith('data:')]
    
    print(f"URL: {url}")
    print(f"  og:image: {og_val}")
    print(f"  found {len(imgs)} imgs. First 3: {imgs[:3]}")

