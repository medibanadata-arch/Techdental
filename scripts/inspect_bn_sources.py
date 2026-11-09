import urllib.request, re
from bs4 import BeautifulSoup

def crawl_category(base_url):
    print(f"=== Crawling Category: {base_url} ===")
    page = 1
    all_posts = []
    while True:
        url = base_url if page == 1 else f"{base_url}page/{page}/"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            resp = urllib.request.urlopen(req, timeout=12)
            html = resp.read().decode('utf-8', errors='ignore')
        except Exception as e:
            print(f"Page {page} error or reached end: {e}")
            break

        soup = BeautifulSoup(html, 'html.parser')
        # find post article links
        articles = soup.find_all('article')
        print(f"Page {page}: found {len(articles)} articles")
        if not articles:
            # try finding headers or links with class
            links = [a['href'] for a in soup.find_all('a', href=True) if '/bn/' in a['href'] and ('/medicine/' in a['href'] or '/dental/' in a['href'] or '/physician/' in a['href'] or '/update/' in a['href'] or '/uncategorized/' in a['href'])]
            print(f"Fallback found {len(links)} links")
            if not links:
                break
            for l in set(links):
                if l not in all_posts and not l.endswith('/blog/medical/') and not l.endswith('/blog/dental/') and '/page/' not in l:
                    all_posts.append(l)
        else:
            for art in articles:
                a_tag = art.find('a', href=True)
                if a_tag and a_tag['href'] not in all_posts:
                    all_posts.append(a_tag['href'])

        # Check for next page
        next_link = soup.find('a', class_=re.compile(r'next|page-numbers'))
        pagination = soup.find('div', class_=re.compile(r'pagination|nav-links'))
        print(f"Page {page} pagination found:", bool(pagination or next_link))
        page += 1
        if page > 15: # safety cap
            break

    print(f"Total unique post URLs in {base_url}: {len(all_posts)}")
    for p in all_posts[:10]:
        print("  -", p)
    return all_posts

crawl_category('https://techdentalcare.com/bn/blog/medical/')
crawl_category('https://techdentalcare.com/bn/blog/dental/')

