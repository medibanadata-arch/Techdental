import urllib.request
from bs4 import BeautifulSoup
import json

def parse_archive(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    articles = soup.find_all('article')
    results = []
    for art in articles:
        # title
        h_tag = art.find(['h1', 'h2', 'h3'])
        a_title = h_tag.find('a') if h_tag else None
        title = a_title.get_text(strip=True) if a_title else (h_tag.get_text(strip=True) if h_tag else "")
        link = a_title['href'] if a_title and a_title.has_attr('href') else ""
        
        # img
        img = art.find('img')
        img_src = ""
        if img:
            img_src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or ""
            
        # excerpt
        desc = art.find(['div', 'p'], class_=lambda c: c and ('excerpt' in c or 'content' in c))
        excerpt = desc.get_text(strip=True) if desc else ""
        
        # date
        time_tag = art.find('time')
        date_str = time_tag.get_text(strip=True) if time_tag else ""
        
        results.append({
            'title': title,
            'link': link,
            'img': img_src,
            'excerpt': excerpt,
            'date': date_str
        })
    return results

en_posts = parse_archive("https://techdentalcare.com/blog-en/dental/")
bn_posts = parse_archive("https://techdentalcare.com/bn/blog/dental/")

print("=== EN POSTS ON /blog-en/dental/ ===")
print(json.dumps(en_posts, indent=2, ensure_ascii=False))

print("=== BN POSTS ON /bn/blog/dental/ ===")
print(json.dumps(bn_posts, indent=2, ensure_ascii=False))

