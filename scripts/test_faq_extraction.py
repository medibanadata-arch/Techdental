import urllib.request
from bs4 import BeautifulSoup
import re

req = urllib.request.Request("https://techdentalcare.com/medicine/napa-500mg/", headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req).read().decode('utf-8')
soup = BeautifulSoup(html, 'html.parser')
entry = soup.find(class_=lambda c: c and 'elementor-widget-theme-post-content' in c)

# Let's extract FAQs BEFORE clean_html
faqs = []
faq_started = False
curr_q = None

for el in entry.find_all(['h2', 'h3', 'h4', 'p']):
    txt = el.get_text(strip=True)
    if any(k in txt.lower() for k in ['frequently asked', 'faq', 'সাধারণ জিজ্ঞাসা']):
        faq_started = True
        continue
    if faq_started:
        if 'disclaimer:' in txt.lower():
            break
        if el.name in ['h2', 'h3', 'h4'] or '?' in txt or txt.startswith('Q:'):
            curr_q = txt
        elif el.name == 'p' and curr_q:
            faqs.append({'q': curr_q, 'a': txt})
            curr_q = None

print("Extracted FAQs:")
for f in faqs:
    print("Q:", f['q'])
    print("A:", f['a'])

