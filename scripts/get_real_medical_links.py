import urllib.request
from bs4 import BeautifulSoup

def fetch_medical_urls():
    url = "https://techdentalcare.com/blog-en/medical/"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    
    links = []
    for a in soup.find_all('a', href=True):
        h = a['href']
        if '/medicine/' in h:
            h = h.split('?')[0].rstrip('/') + '/'
            if h not in links and h != 'https://techdentalcare.com/medicine/':
                links.append(h)
    return links

med_links = fetch_medical_urls()
print(f"Found {len(med_links)} medicine links on /blog-en/medical/:")
for l in med_links[:15]:
    print(" ", l)

