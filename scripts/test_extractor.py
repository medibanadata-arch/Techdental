import urllib.request
from bs4 import BeautifulSoup
import json
import re

def test_fetch(url):
    print(f"\n=================== {url} ===================")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
    soup = BeautifulSoup(html, 'html.parser')
    
    # Title
    h1 = soup.find('h1')
    title = h1.get_text(strip=True) if h1 else (soup.title.get_text(strip=True) if soup.title else "")
    print(f"Title: {title}")
    
    # Meta desc
    meta_desc = ""
    m = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
    if m:
        meta_desc = m.get('content', '')
    print(f"Meta Desc: {meta_desc[:120]}...")
    
    # Featured image
    og_img = soup.find('meta', attrs={'property': 'og:image'})
    feat_img = og_img.get('content', '') if og_img else ""
    print(f"Featured Image: {feat_img}")
    
    # Entry content
    entry = soup.find(class_=lambda c: c and any(x in c for x in ['entry-content', 'post-content', 'article-content', 'elementor-widget-theme-post-content']))
    if not entry:
        entry = soup.find('article')
        
    if entry:
        print(f"Content Length: {len(entry.get_text(strip=True))} chars")
        h2s = [h.get_text(strip=True) for h in entry.find_all('h2')]
        print(f"H2 Headings ({len(h2s)}): {h2s}")
        
        # Check FAQs
        faq_section = None
        for h2 in entry.find_all('h2'):
            if 'faq' in h2.get_text().lower() or 'frequently asked' in h2.get_text().lower():
                faq_section = h2
                break
        if faq_section:
            print("Found FAQ Section:", faq_section.get_text(strip=True))
    else:
        print("No entry found!")

test_fetch('https://techdentalcare.com/medicine/naproxen-500/')
test_fetch('https://techdentalcare.com/update/case-study/case-study-root-canal/')
test_fetch('https://techdentalcare.com/physician/best-dentist-chittagong/')

