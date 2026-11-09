import urllib.request
from bs4 import BeautifulSoup

test_urls = [
    'https://techdentalcare.com/physician/best-dentist-chittagong/',
    'https://techdentalcare.com/update/find-your-nearest-tech-dental-clinic/',
    'https://techdentalcare.com/update/case-study/case-study-root-canal/',
    'https://techdentalcare.com/update/centres/digital-smile-design-center/',
    'https://techdentalcare.com/uncategorized-en/call-center-jobs/'
]

for url in test_urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'html.parser')
        h1 = soup.find('h1')
        title = h1.get_text(strip=True) if h1 else 'No H1'
        h2s = [h.get_text(strip=True) for h in soup.find_all('h2')][:4]
        print(f"URL: {url}")
        print(f"Title: {title}")
        print(f"H2s: {h2s}\n")
    except Exception as e:
        print(f"Error {url}: {e}\n")

