import urllib.request
from bs4 import BeautifulSoup
import json

urls_en = [
    "https://techdentalcare.com/dental/best-orthodontist-doctor-in-dhaka/",
    "https://techdentalcare.com/dental/best-dental-clinic-in-chennai/",
    "https://techdentalcare.com/dental/bad-breath-causes/",
    "https://techdentalcare.com/dental/gum-cancer-symptoms-causes/",
    "https://techdentalcare.com/dental/wisdom-tooth-pain-relief-tips/",
    "https://techdentalcare.com/dental/toothache-relief/"
]

urls_bn = [
    "https://techdentalcare.com/bn/dentistry/orthodontic-centre-tech-dental/",
    "https://techdentalcare.com/bn/dentistry/bad-breath-remedies/",
    "https://techdentalcare.com/bn/dentistry/gum-cancer-symptoms/",
    "https://techdentalcare.com/bn/dentistry/wisdom-tooth-pain-relief/",
    "https://techdentalcare.com/bn/dentistry/toothache-relief-tips/",
    "https://techdentalcare.com/bn/dentistry/tooth-cavity-home-remedies/"
]

def check_urls(urls):
    for u in urls:
        req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
        try:
            html = urllib.request.urlopen(req).read().decode('utf-8')
            soup = BeautifulSoup(html, 'html.parser')
            title = soup.find('h1')
            title_text = title.get_text(strip=True) if title else "NO H1"
            # featured image
            og_img = soup.find('meta', property='og:image')
            img_url = og_img['content'] if og_img else None
            print(f"URL: {u}\n  Title: {title_text}\n  Image: {img_url}\n")
        except Exception as e:
            print(f"URL: {u} ERROR: {e}")

print("=== CHECKING EN URLS ===")
check_urls(urls_en)

print("=== CHECKING BN URLS ===")
check_urls(urls_bn)
