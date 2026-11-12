import urllib.request
from bs4 import BeautifulSoup

def get_all_archive_urls(base_url):
    all_links = []
    page = 1
    while True:
        url = f"{base_url}page/{page}/" if page > 1 else base_url
        print("Checking:", url)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            html = urllib.request.urlopen(req).read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            
            links = []
            for a in soup.find_all('a', href=True):
                h = a['href'].split('?')[0].rstrip('/') + '/'
                if ('/medicine/' in h or '/medication/' in h) and h != 'https://techdentalcare.com/medicine/' and h != 'https://techdentalcare.com/bn/medication/':
                    if h not in all_links and h not in links:
                        links.append(h)
            if not links:
                print(f"No more links on page {page}")
                break
            all_links.extend(links)
            page += 1
        except Exception as e:
            print(f"Ended at page {page}: {e}")
            break
    return all_links

en_meds = get_all_archive_urls("https://techdentalcare.com/blog-en/medical/")
print(f"Total English medicines found: {len(en_meds)}")

bn_meds = get_all_archive_urls("https://techdentalcare.com/bn/blog/medical/")
print(f"Total Bangla medicines found: {len(bn_meds)}")

