import urllib.request
from bs4 import BeautifulSoup
from migrator_base import HEADERS

for url in [
    "https://techdentalcare.com/uncategorized-en/medicines-and-4-home-remedies-to-reduce-tooth-pain/",
    "https://techdentalcare.com/uncategorized-en/call-center-jobs/"
]:
    req = urllib.request.Request(url, headers=HEADERS)
    html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
    soup = BeautifulSoup(html, 'html.parser')
    for img in soup.find_all('img'):
        print(url, "img:", img.get('src') or img.get('data-src') or img.get('data-lazy-src'))
