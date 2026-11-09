import urllib.request
from bs4 import BeautifulSoup

url = "https://techdentalcare.com/bn/medication/napa-extra-tablet/"
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)
html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
soup = BeautifulSoup(html, 'html.parser')

print("Title:", soup.find('h1').get_text(strip=True) if soup.find('h1') else 'No h1')
entry = soup.find(class_=lambda c: c and any(x in c for x in ['entry-content', 'post-content']))
if entry:
    paras = [p.get_text(strip=True) for p in entry.find_all('p') if len(p.get_text(strip=True)) > 20]
    print(f"Paras count: {len(paras)}")
    print("First para:", paras[0] if paras else 'None')
    h2s = [h.get_text(strip=True) for h in entry.find_all(['h2', 'h3'])]
    print("Headings:", h2s[:5])

