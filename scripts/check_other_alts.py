import urllib.request
from bs4 import BeautifulSoup

urls = [
    "https://techdentalcare.com/dental/bad-breath-causes/",
    "https://techdentalcare.com/dental/gum-cancer-symptoms-causes/",
    "https://techdentalcare.com/dental/wisdom-tooth-pain-relief-tips/",
    "https://techdentalcare.com/dental/toothache-relief/"
]

for u in urls:
    req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    alts = {l.get('hreflang'): l.get('href') for l in soup.find_all('link', rel='alternate') if l.get('hreflang')}
    print(u, "-->", alts)

