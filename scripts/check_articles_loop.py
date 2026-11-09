import urllib.request
from bs4 import BeautifulSoup

url = 'https://techdentalcare.com/blog-en/medical/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
soup = BeautifulSoup(html, 'html.parser')

articles = soup.find_all('article')
print(f"Found {len(articles)} article tags:")
for art in articles:
    heading = art.find(['h1', 'h2', 'h3', 'h4'])
    a = art.find('a', href=True)
    title = heading.get_text(strip=True) if heading else (a.get_text(strip=True) if a else 'No Title')
    link = a['href'] if a else 'No Link'
    print(f" - {title} ({link})")

pagination = soup.find(class_=re.compile(r'pagination|nav-links'))
if pagination:
    print("Pagination links:", [a['href'] for a in pagination.find_all('a', href=True)])

