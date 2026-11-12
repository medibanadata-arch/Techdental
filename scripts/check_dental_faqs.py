import urllib.request
from bs4 import BeautifulSoup

urls = [
    "https://techdentalcare.com/dental/best-orthodontist-doctor-in-dhaka/",
    "https://techdentalcare.com/dental/best-dental-clinic-in-chennai/",
    "https://techdentalcare.com/dental/bad-breath-causes/",
    "https://techdentalcare.com/dental/gum-cancer-symptoms-causes/",
    "https://techdentalcare.com/dental/wisdom-tooth-pain-relief-tips/",
    "https://techdentalcare.com/dental/toothache-relief/",
    "https://techdentalcare.com/bn/dentistry/orthodontic-centre-tech-dental/",
    "https://techdentalcare.com/bn/dentistry/bad-breath-remedies/",
    "https://techdentalcare.com/bn/dentistry/gum-cancer-symptoms/",
    "https://techdentalcare.com/bn/dentistry/wisdom-tooth-pain-relief/",
    "https://techdentalcare.com/bn/dentistry/toothache-relief-tips/",
    "https://techdentalcare.com/bn/dentistry/tooth-cavity-home-remedies/"
]

for u in urls:
    try:
        req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        has_faq = any(k in html.lower() for k in ['frequently asked', 'faq', 'সাধারণ জিজ্ঞাসা', 'প্রশ্নোত্তর'])
        print(f"{u.split('/')[-2]}: FAQ found = {has_faq}")
    except Exception as e:
        print(f"{u.split('/')[-2]}: ERROR {e}")

