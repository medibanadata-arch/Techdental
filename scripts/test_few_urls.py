import urllib.request
from bs4 import BeautifulSoup
from migrator_base import HEADERS

for url in [
    "https://techdentalcare.com/medicine/coralcal-dx/",
    "https://techdentalcare.com/uncategorized-en/medicines-and-4-home-remedies-to-reduce-tooth-pain/",
    "https://techdentalcare.com/medicine/exium-mups-20/",
    "https://techdentalcare.com/medicine/pantonix-20/"
]:
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        html = urllib.request.urlopen(req, timeout=12).read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'html.parser')
        og = soup.find('meta', attrs={'property': 'og:image'})
        print(f"{url} -> {og.get('content') if og else 'No og'}")
    except Exception as e:
        print(f"Error {url}: {e}")

