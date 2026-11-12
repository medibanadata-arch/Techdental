import urllib.request
from bs4 import BeautifulSoup
import os

os.makedirs('public/uploads/posts', exist_ok=True)

en_urls = [
    "https://techdentalcare.com/dental/best-orthodontist-doctor-in-dhaka/",
    "https://techdentalcare.com/dental/best-dental-clinic-in-chennai/",
    "https://techdentalcare.com/dental/bad-breath-causes/",
    "https://techdentalcare.com/dental/gum-cancer-symptoms-causes/",
    "https://techdentalcare.com/dental/wisdom-tooth-pain-relief-tips/",
    "https://techdentalcare.com/dental/toothache-relief/"
]

bn_urls = [
    "https://techdentalcare.com/bn/dentistry/orthodontic-centre-tech-dental/",
    "https://techdentalcare.com/bn/dentistry/bad-breath-remedies/",
    "https://techdentalcare.com/bn/dentistry/gum-cancer-symptoms/",
    "https://techdentalcare.com/bn/dentistry/wisdom-tooth-pain-relief/",
    "https://techdentalcare.com/bn/dentistry/toothache-relief-tips/",
    "https://techdentalcare.com/bn/dentistry/tooth-cavity-home-remedies/"
]

def get_real_image(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    og = soup.find('meta', property='og:image')
    if og and og.get('content'):
        return og['content']
    img = soup.find('article').find('img') if soup.find('article') else soup.find('img')
    return img.get('src') if img else None

print("Fetching EN post images...")
for u in en_urls:
    img = get_real_image(u)
    print(u.split('/')[-2], "=>", img)

print("\nFetching BN post images...")
for u in bn_urls:
    img = get_real_image(u)
    print(u.split('/')[-2], "=>", img)

