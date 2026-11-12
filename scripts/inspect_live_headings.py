import urllib.request
from bs4 import BeautifulSoup

url = "https://techdentalcare.com/medicine/napa-500mg/"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req).read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')

entry = soup.find(class_=lambda c: c and 'elementor-widget-theme-post-content' in c)
if entry:
    for h in entry.find_all(['h1', 'h2', 'h3']):
        print(f"<{h.name}>", h.get_text(strip=True))

