import urllib.request
from bs4 import BeautifulSoup
import re
import json

def extract_medicine_data(en_url, bn_url):
    def fetch_soup(url):
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        return BeautifulSoup(html, 'html.parser')

    def get_faqs_and_disclaimer(entry):
        faqs = []
        disclaimer = None
        if not entry:
            return faqs, disclaimer
        
        faq_started = False
        curr_q = None
        
        # Traverse elements
        for el in entry.find_all(['h2', 'h3', 'h4', 'p', 'blockquote']):
            txt = el.get_text(strip=True)
            txt_lower = txt.lower()
            
            # Check disclaimer
            if any(k in txt_lower for k in ['disclaimer:', 'সতর্কতা:', 'সতর্কবার্তা:', 'দায়মুক্তি:']):
                disclaimer = txt
                continue
                
            # Check FAQ header
            if any(k in txt_lower for k in ['frequently asked', 'faq', 'সাধারণ জিজ্ঞাসা', 'প্রশ্নোত্তর', 'সচরাচর জিজ্ঞাসিত', 'সম্পর্কে সচরাচর']):
                faq_started = True
                continue
                
            if faq_started:
                # Stop if another major section starts
                if el.name in ['h1', 'h2'] and not any(k in txt_lower for k in ['q:', 'প্রশ্ন', 'faq', '?']):
                    break
                    
                is_q = (el.name in ['h3', 'h4'] or '?' in txt or txt.startswith('Q:') or txt.startswith('প্রশ্ন:') or txt.startswith('প্রশ্ন '))
                if is_q:
                    curr_q = re.sub(r'^(?:Q\s*:\s*|প্রশ্ন\s*:\s*)', '', txt).strip()
                elif el.name in ['p', 'div'] and curr_q:
                    ans = re.sub(r'^(?:A\s*:\s*|Ans\s*:\s*|উত্তর\s*:\s*)', '', txt).strip()
                    if ans and len(ans) > 3:
                        faqs.append({'q': curr_q, 'a': ans})
                        curr_q = None
        return faqs, disclaimer

    soup_en = fetch_soup(en_url)
    entry_en = soup_en.find(class_=lambda c: c and 'elementor-widget-theme-post-content' in c) or soup_en.find('article')
    faqs_en, disc_en = get_faqs_and_disclaimer(entry_en)

    soup_bn = fetch_soup(bn_url)
    entry_bn = soup_bn.find(class_=lambda c: c and 'elementor-widget-theme-post-content' in c) or soup_bn.find('article')
    faqs_bn, disc_bn = get_faqs_and_disclaimer(entry_bn)

    print(f"=== {en_url.split('/')[-2]} ===")
    print(f"EN FAQs found: {len(faqs_en)}")
    for f in faqs_en[:2]:
        print("  EN Q:", f['q'])
        print("  EN A:", f['a'][:60])
    print("EN Disclaimer:", disc_en)

    print(f"BN FAQs found: {len(faqs_bn)}")
    for f in faqs_bn[:2]:
        print("  BN Q:", f['q'])
        print("  BN A:", f['a'][:60])
    print("BN Disclaimer:", disc_bn)

# Test on 3 items
test_items = [
    ("https://techdentalcare.com/medicine/napa-500mg/", "https://techdentalcare.com/bn/medication/napa-500mg-bd/"),
    ("https://techdentalcare.com/medicine/monas-10-tablet/", "https://techdentalcare.com/bn/medication/bn-monas-10-tablet/"),
    ("https://techdentalcare.com/medicine/tufnil-200-tablet/", "https://techdentalcare.com/bn/medication/tufnil-200-mg-tablet/")
]

for en, bn in test_items:
    extract_medicine_data(en, bn)

