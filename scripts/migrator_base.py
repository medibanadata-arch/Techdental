import os
import sys
import re
import json
import sqlite3
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import time

URLS = [
    "https://techdentalcare.com/medicine/xyril-25-tablet/",
    "https://techdentalcare.com/medicine/naproxen-500/",
    "https://techdentalcare.com/medicine/napa-500mg/",
    "https://techdentalcare.com/medicine/cef-3-capsule-suspension/",
    "https://techdentalcare.com/physician/best-dentist-chittagong/",
    "https://techdentalcare.com/update/find-your-nearest-tech-dental-clinic/",
    "https://techdentalcare.com/medicine/napa-extra/",
    "https://techdentalcare.com/medicine/mm-kit-tablet/",
    "https://techdentalcare.com/medicine/napa-extend-665mg-tablet/",
    "https://techdentalcare.com/medicine/amdocal-5/",
    "https://techdentalcare.com/dental/dhaka-dental-college-hospital-updated-2026/",
    "https://techdentalcare.com/medicine/amodis-400/",
    "https://techdentalcare.com/dental/toothache-relief/",
    "https://techdentalcare.com/medicine/monas-10-tablet/",
    "https://techdentalcare.com/medicine/omidon-10/",
    "https://techdentalcare.com/medicine/sergel-20-tablet/",
    "https://techdentalcare.com/medicine/dexilend-30-capsule/",
    "https://techdentalcare.com/update/advanced-sterilization-at-tech-dental/",
    "https://techdentalcare.com/update/case-study/case-study-root-canal/",
    "https://techdentalcare.com/medicine/intimate-10-tablet/",
    "https://techdentalcare.com/dental/best-orthodontist-doctor-in-dhaka/",
    "https://techdentalcare.com/medicine/traxyl-500/",
    "https://techdentalcare.com/medicine/viset-50/",
    "https://techdentalcare.com/medicine/ciprocin-500-tablet/",
    "https://techdentalcare.com/medicine/indever-10-tablet/",
    "https://techdentalcare.com/medicine/norium-10/",
    "https://techdentalcare.com/update/case-study/case-study-orthodontic-correction-en/",
    "https://techdentalcare.com/update/case-study/case-study-invisalign-en/",
    "https://techdentalcare.com/medicine/neuro-b-tablet/",
    "https://techdentalcare.com/update/centres/digital-smile-design-center/",
    "https://techdentalcare.com/medicine/algin-50-tablet/",
    "https://techdentalcare.com/medicine/bactrocin-2-ointment/",
    "https://techdentalcare.com/medicine/coralcal-dx/",
    "https://techdentalcare.com/update/centres/special-needs-patient-care/",
    "https://techdentalcare.com/dental/dental-implants-bangladesh/",
    "https://techdentalcare.com/dental/gum-cancer-symptoms-causes/",
    "https://techdentalcare.com/medicine/emistat-8-mg/",
    "https://techdentalcare.com/dental/dental-implants-near-me/",
    "https://techdentalcare.com/medicine/exium-mups-20/",
    "https://techdentalcare.com/medicine/pantonix-20/",
    "https://techdentalcare.com/update/case-study/case-study-aesthetic-rehabilitation-via-direct-composite-veneers/",
    "https://techdentalcare.com/dental/wisdom-tooth-pain-relief-tips/",
    "https://techdentalcare.com/dental/best-dental-clinic-in-chennai/",
    "https://techdentalcare.com/medicine/doxiva-200-tablet/",
    "https://techdentalcare.com/medicine/alatrol-10/",
    "https://techdentalcare.com/medicine/rivotril-0-5-tablet/",
    "https://techdentalcare.com/medicine/naprosyn-500-tablet/",
    "https://techdentalcare.com/medicine/xinc-b-tablet/",
    "https://techdentalcare.com/medicine/bilastine-20/",
    "https://techdentalcare.com/medicine/clas-75/",
    "https://techdentalcare.com/update/case-study/case-study-dental-implant-en/",
    "https://techdentalcare.com/update/dental-emergency-24-7/",
    "https://techdentalcare.com/medicine/maxpro-20/",
    "https://techdentalcare.com/medicine/normens-5/",
    "https://techdentalcare.com/medicine/bislol-2-5-tablet/",
    "https://techdentalcare.com/uncategorized-en/call-center-jobs/",
    "https://techdentalcare.com/medicine/alcet-5-tablet/",
    "https://techdentalcare.com/uncategorized-en/medicines-and-4-home-remedies-to-reduce-tooth-pain/",
    "https://techdentalcare.com/medicine/furoclav-500/",
    "https://techdentalcare.com/medicine/tufnil-200-tablet/",
    "https://techdentalcare.com/update/centres/dental-implants-centre/",
    "https://techdentalcare.com/dental/bad-breath-causes/",
    "https://techdentalcare.com/medicine/zimax-500-tablet/",
    "https://techdentalcare.com/dental/dental-crown-info/",
    "https://techdentalcare.com/medicine/bicozin-tablet/",
    "https://techdentalcare.com/medicine/d-rise-40000iu/",
    "https://techdentalcare.com/tech-physio/tech-physio-launch/",
    "https://techdentalcare.com/update/case-study/case-study-teeth-whitening-en/",
    "https://techdentalcare.com/medicine/fenadin-120-tablet/",
    "https://techdentalcare.com/medicine/e-cap-400-iu-capsule/",
    "https://techdentalcare.com/update/centres/maxillofacial-surgery-center/",
    "https://techdentalcare.com/update/centres/orthodontic-centre/",
    "https://techdentalcare.com/dental/medication-and-treatment-to-reduce-swollen-gums-and-pain/",
    "https://techdentalcare.com/physician/best-dermatologist-dhaka/",
    "https://techdentalcare.com/update/case-study/smile-design/",
    "https://techdentalcare.com/medicine/fexo-120-tablet/",
    "https://techdentalcare.com/medicine/flexibac-10-mg/",
    "https://techdentalcare.com/update/patient-bill-of-rights-and-responsibilities/",
    "https://techdentalcare.com/uncategorized-en/tech-dental-farewell-and-welcome-program-2026/",
    "https://techdentalcare.com/medicine/cortan-20/",
    "https://techdentalcare.com/medicine/ecosprin-75/",
    "https://techdentalcare.com/medicine/rosutin-10/"
]

os.makedirs('public/uploads/medicines', exist_ok=True)
os.makedirs('public/uploads/posts', exist_ok=True)

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def fetch_html(url, retries=3):
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=18) as res:
                return res.read().decode('utf-8', errors='ignore')
        except Exception as e:
            if i == retries - 1:
                print(f"Failed to fetch {url}: {e}")
                return None
            time.sleep(1.5)
    return None

def download_image(img_url, folder='public/uploads/medicines'):
    if not img_url or img_url.startswith('data:'):
        return None
    try:
        # Sanitize filename
        parsed = urllib.parse.urlparse(img_url)
        base_name = os.path.basename(parsed.path)
        base_name = re.sub(r'-\d+x\d+(\.[a-zA-Z0-9]+)$', r'\1', base_name) # strip WP thumbnail suffix
        if not base_name or '.' not in base_name:
            base_name = f"img_{int(time.time()*1000)}.webp"
        
        target_path = os.path.join(folder, base_name)
        web_path = '/' + target_path.replace('\\', '/')
        
        if os.path.exists(target_path) and os.path.getsize(target_path) > 100:
            return web_path
            
        req = urllib.request.Request(img_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=12) as res:
            data = res.read()
            if len(data) > 100:
                with open(target_path, 'wb') as f:
                    f.write(data)
                return web_path
    except Exception as e:
        print(f"Error downloading {img_url}: {e}")
    return None

def extract_faqs_from_entry(soup, entry):
    faqs = []
    faq_h2 = None
    for h2 in entry.find_all('h2'):
        txt = h2.get_text().lower()
        if 'faq' in txt or 'frequently asked' in txt or 'সাধারণ জিজ্ঞাসা' in txt or 'question' in txt:
            faq_h2 = h2
            break
            
    if faq_h2:
        curr = faq_h2.next_sibling
        current_q = None
        current_a = []
        
        while curr:
            if curr.name in ['h1', 'h2']:
                break
            if curr.name in ['h3', 'h4', 'strong', 'b'] or (curr.name == 'p' and curr.find(['strong', 'b']) and len(curr.get_text()) < 120 and '?' in curr.get_text()):
                if current_q and current_a:
                    faqs.append({'q': current_q, 'a': " ".join(current_a).strip()})
                    current_a = []
                current_q = re.sub(r'^(?:Q\s*:|FAQ\s*\d*\s*:|\d+\.|\?)\s*', '', curr.get_text(strip=True))
                if not current_q.endswith('?'):
                    current_q += '?'
            elif curr.name in ['p', 'div', 'ul', 'ol']:
                txt = curr.get_text(strip=True)
                if txt:
                    if txt.lower().startswith('q:') or txt.lower().startswith('q.'):
                        if current_q and current_a:
                            faqs.append({'q': current_q, 'a': " ".join(current_a).strip()})
                            current_a = []
                        current_q = re.sub(r'^[Qq][\:\.]\s*', '', txt)
                    else:
                        current_a.append(txt)
            curr = curr.next_sibling
            
        if current_q and current_a:
            faqs.append({'q': current_q, 'a': " ".join(current_a).strip()})

    # Also check JSON-LD Schema for FAQPage
    for s in soup.find_all('script', type='application/ld+json'):
        try:
            data = json.loads(s.string or '{}')
            if isinstance(data, dict) and data.get('@type') == 'FAQPage':
                for elem in data.get('mainEntity', []):
                    q = elem.get('name')
                    a = elem.get('acceptedAnswer', {}).get('text')
                    if q and a and not any(f['q'] == q for f in faqs):
                        faqs.append({'q': q, 'a': re.sub(r'<[^>]+>', '', a).strip()})
            elif isinstance(data, list):
                for sub in data:
                    if isinstance(sub, dict) and sub.get('@type') == 'FAQPage':
                        for elem in sub.get('mainEntity', []):
                            q = elem.get('name')
                            a = elem.get('acceptedAnswer', {}).get('text')
                            if q and a and not any(f['q'] == q for f in faqs):
                                faqs.append({'q': q, 'a': re.sub(r'<[^>]+>', '', a).strip()})
        except:
            pass
            
    return faqs

print("Migrator module ready!")
