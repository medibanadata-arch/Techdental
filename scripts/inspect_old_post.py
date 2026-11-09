import urllib.request
from bs4 import BeautifulSoup
import json

url = 'https://techdentalcare.com/medicine/xyril-25-tablet/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
soup = BeautifulSoup(html, 'html.parser')

print("=== TITLE ===")
title = soup.find('h1')
print(title.get_text(strip=True) if title else "No H1")

print("\n=== HEADINGS ===")
for h in soup.find_all(['h2', 'h3']):
    print(h.name, ':', h.get_text(strip=True))

print("\n=== MAIN CONTENT SELECTOR ===")
entry = soup.find(class_=lambda c: c and any(x in c for x in ['entry-content', 'post-content', 'article-content']))
if entry:
    print("Found entry class:", entry.get('class'))
    text = entry.get_text(strip=True)
    print("Content text length:", len(text))
    print("First 300 chars:", text[:300])
    
    images = [img.get('src') for img in entry.find_all('img')]
    print(f"Images in content ({len(images)}):", images[:5])
else:
    print("No entry content found")
