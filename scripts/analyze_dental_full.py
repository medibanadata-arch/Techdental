import urllib.request
from bs4 import BeautifulSoup
import json
import os

en_dental = [
    "https://techdentalcare.com/dental/best-orthodontist-doctor-in-dhaka/",
    "https://techdentalcare.com/dental/best-dental-clinic-in-chennai/",
    "https://techdentalcare.com/dental/bad-breath-causes/",
    "https://techdentalcare.com/dental/gum-cancer-symptoms-causes/",
    "https://techdentalcare.com/dental/wisdom-tooth-pain-relief-tips/",
    "https://techdentalcare.com/dental/toothache-relief/"
]

bn_dental = [
    "https://techdentalcare.com/bn/dentistry/orthodontic-centre-tech-dental/",
    "https://techdentalcare.com/bn/dentistry/bad-breath-remedies/",
    "https://techdentalcare.com/bn/dentistry/gum-cancer-symptoms/",
    "https://techdentalcare.com/bn/dentistry/wisdom-tooth-pain-relief/",
    "https://techdentalcare.com/bn/dentistry/toothache-relief-tips/",
    "https://techdentalcare.com/bn/dentistry/tooth-cavity-home-remedies/"
]

def analyze_post(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req).read().decode('utf-8')
    soup = BeautifulSoup(html, 'html.parser')
    h1 = soup.find('h1')
    title = h1.get_text(strip=True) if h1 else ""
    og_img = soup.find('meta', property='og:image')
    img = og_img['content'] if og_img else ""
    entry = soup.find(class_=lambda c: c and 'elementor-widget-theme-post-content' in c) or soup.find('article')
    
    # check FAQs
    faqs = []
    if entry:
        faq_started = False
        curr_q = None
        for el in entry.find_all(['h2', 'h3', 'h4', 'p']):
            txt = el.get_text(strip=True)
            if any(k in txt.lower() for k in ['frequently asked', 'faq', 'সাধারণ জিজ্ঞাসা', 'প্রশ্নোত্তর']):
                faq_started = True
                continue
            if faq_started:
                if 'disclaimer:' in txt.lower() or 'সতর্কতা:' in txt.lower():
                    break
                if el.name in ['h2', 'h3', 'h4'] or '?' in txt or txt.startswith('Q:') or txt.startswith('প্রশ্ন'):
                    curr_q = txt
                elif el.name == 'p' and curr_q:
                    faqs.append({'q': curr_q, 'a': txt})
                    curr_q = None
    return {
        'url': url,
        'slug': url.rstrip('/').split('/')[-1],
        'title': title,
        'img': img,
        'faqs': faqs,
        'content_len': len(entry.get_text()) if entry else 0
    }

print("=== Analyzing 6 EN Dental Posts ===")
for u in en_dental:
    res = analyze_post(u)
    print(res['slug'], "| FAQs:", len(res['faqs']), "| Content len:", res['content_len'], "| Img:", res['img'][:50])

print("\n=== Analyzing 6 BN Dental Posts ===")
for u in bn_dental:
    res = analyze_post(u)
    print(res['slug'], "| FAQs:", len(res['faqs']), "| Content len:", res['content_len'], "| Img:", res['img'][:50])

