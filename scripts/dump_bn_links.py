import urllib.request, json
from bs4 import BeautifulSoup

def get_posts_from_cat(cat_url):
    page = 1
    all_links = []
    while True:
        url = cat_url if page == 1 else f"{cat_url}{page}/"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            resp = urllib.request.urlopen(req, timeout=10)
            if resp.status != 200: break
            html = resp.read().decode('utf-8', errors='ignore')
        except Exception as e:
            break

        soup = BeautifulSoup(html, 'html.parser')
        post_links = []
        for a in soup.find_all('a', href=True):
            h = a['href']
            if 'techdentalcare.com/bn/' in h and any(x in h for x in ['/medication/', '/dentistry/', '/physicians/', '/updates/', '/uncategorized-bn/']):
                if h not in post_links:
                    post_links.append(h)
        for pl in post_links:
            if pl not in all_links:
                all_links.append(pl)

        has_next = any('next' in a.get_text(strip=True).lower() or f'/{page+1}/' in a.get('href', '') for a in soup.find_all('a', href=True))
        if not has_next and page > 1:
            break
        page += 1
        if page > 15: break
    return all_links

med_links = get_posts_from_cat('https://techdentalcare.com/bn/blog/medical/')
dent_links = get_posts_from_cat('https://techdentalcare.com/bn/blog/dental/')

with open('scripts/bn_links.json', 'w', encoding='utf-8') as f:
    json.dump({'medical': med_links, 'dental': dent_links}, f, indent=2, ensure_ascii=False)

print(f"Medical BN links: {len(med_links)}")
for l in med_links:
    print(" ", l)

print(f"Dental BN links: {len(dent_links)}")
for l in dent_links:
    print(" ", l)

