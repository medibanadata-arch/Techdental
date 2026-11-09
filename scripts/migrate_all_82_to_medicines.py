import os
import re
import json
import time
import sqlite3
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

from migrator_base import URLS, HEADERS
from master_migration_base import download_file, fetch_soup, find_best_image, clean_html, extract_faqs

conn = sqlite3.connect('database/database.sqlite')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Bengali map of known medicine names & generics
BN_MAPPINGS = {
    "xyril-25-tablet": {"name_bn": "এক্সাইরিল ২৫ ট্যাবলেট", "generic_bn": "হাইড্রোক্সিজিন হাইড্রোক্লোরাইড ২৫ মি.গ্রা.", "pharma_bn": "অপসোনিন ফার্মা"},
    "naproxen-500": {"name_bn": "ন্যাপ্রোক্সেন ৫০০ ট্যাবলেট", "generic_bn": "ন্যাপ্রোক্সেন ৫০০ মি.গ্রা.", "pharma_bn": "ইনসেপ্টা ফার্মাসিউটিক্যালস"},
    "napa-500mg": {"name_bn": "নাপা ৫০০ মি.গ্রা. ট্যাবলেট", "generic_bn": "প্যারাসিটামল ৫০০ মি.গ্রা.", "pharma_bn": "বেক্সিমকো ফার্মাসিউটিক্যালস"},
    "cef-3-capsule-suspension": {"name_bn": "সেফ-৩ ক্যাপসুল ও সাসপেনশন", "generic_bn": "সেফিক্সিম ট্রাইহাইড্রেট ২০০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "napa-extra": {"name_bn": "নাপা এক্সট্রা ট্যাবলেট", "generic_bn": "প্যারাসিটামল ৫০০ মি.গ্রা. + ক্যাফেইন ৬৫ মি.গ্রা.", "pharma_bn": "বেক্সিমকো ফার্মাসিউটিক্যালস"},
    "mm-kit-tablet": {"name_bn": "এমএম কিট ট্যাবলেট", "generic_bn": "মিফেপ্রিস্টোন ২০০ মি.গ্রা. + মিসোপ্রোস্টল ২০০ মাইক্রোগ্রাম", "pharma_bn": "রেনেটা লিমিটেড"},
    "napa-extend-665mg-tablet": {"name_bn": "নাপা এক্সটেন্ড ৬৬৫ মি.গ্রা.", "generic_bn": "প্যারাসিটামল ৬৬৫ মি.গ্রা. (এক্সটেন্ডেড রিলিজ)", "pharma_bn": "বেক্সিমকো ফার্মাসিউটিক্যালস"},
    "amdocal-5": {"name_bn": "এমডোকাল ৫ ট্যাবলেট", "generic_bn": "অ্যামলোডিপিন বিসিলেট ৫ মি.গ্রা.", "pharma_bn": "বেক্সিমকো ফার্মাসিউটিক্যালস"},
    "amodis-400": {"name_bn": "অ্যামোডিস ৪০০ ট্যাবলেট", "generic_bn": "মেট্রোনিডাজল ৪০০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "monas-10-tablet": {"name_bn": "মোনাস ১০ ট্যাবলেট", "generic_bn": "মন্টেলুকাস্ট ১০ মি.গ্রা.", "pharma_bn": "একমি ল্যাবরেটরিজ"},
    "omidon-10": {"name_bn": "অমিডন ১০ ট্যাবলেট", "generic_bn": "ডমপেরিডন ১০ মি.গ্রা.", "pharma_bn": "ইনসেপ্টা ফার্মাসিউটিক্যালস"},
    "sergel-20-tablet": {"name_bn": "সারজেল ২০ ক্যাপসুল", "generic_bn": "এসোমিপ্রাজল ম্যাগনেসিয়াম ট্রাইহাইড্রেট ২০ মি.গ্রা.", "pharma_bn": "হেলথকেয়ার ফার্মাসিউটিক্যালস"},
    "dexilend-30-capsule": {"name_bn": "ডেক্সিল্যান্ড ৩০ ক্যাপসুল", "generic_bn": "ডেক্সল্যান্সোপ্রাজল ৩০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "intimate-10-tablet": {"name_bn": "ইনটিমেট ১০ ট্যাবলেট", "generic_bn": "টাদালাফিল ১০ মি.গ্রা.", "pharma_bn": "পপুলার ফার্মাসিউটিক্যালস"},
    "traxyl-500": {"name_bn": "ট্র্যাক্সিল ৫০০ ক্যাপসুল", "generic_bn": "ট্রানেক্সামিক অ্যাসিড ৫০০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "viset-50": {"name_bn": "ভিসেট ৫০ ট্যাবলেট", "generic_bn": "লোসার্টান পটাশিয়াম ৫০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "ciprocin-500-tablet": {"name_bn": "সিপ্রোসিন ৫০০ ট্যাবলেট", "generic_bn": "সিপ্রোফ্লক্সাসিন ৫০০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "indever-10-tablet": {"name_bn": "ইনডেভার ১০ ট্যাবলেট", "generic_bn": "প্রোপ্রানোলল হাইড্রোক্লোরাইড ১০ মি.গ্রা.", "pharma_bn": "অপসোনিন ফার্মা"},
    "norium-10": {"name_bn": "নরিয়াম ১০ ট্যাবলেট", "generic_bn": "ফ্লুনারিজিন ১০ মি.গ্রা.", "pharma_bn": "ইনসেপ্টা ফার্মাসিউটিক্যালস"},
    "neuro-b-tablet": {"name_bn": "নিউরো-বি ট্যাবলেট", "generic_bn": "ভিটামিন বি১ + বি৬ + বি১২", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "algin-50-tablet": {"name_bn": "আলজিন ৫০ ট্যাবলেট", "generic_bn": "টিমোনিয়াম মিথাইলসালফেট ৫০ মি.গ্রা.", "pharma_bn": "রেনেটা লিমিটেড"},
    "bactrocin-2-ointment": {"name_bn": "ব্যাকট্রোসিন ২% মলম", "generic_bn": "মুপিরোসিন ২%", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "coralcal-dx": {"name_bn": "কোরালক্যাল ডিএক্স ট্যাবলেট", "generic_bn": "কোরাল ক্যালসিয়াম ৫০০ মি.গ্রা. + ভিটামিন ডি৩ ২০০ আইইউ", "pharma_bn": "রেডিয়েন্ট ফার্মাসিউটিক্যালস"},
    "emistat-8-mg": {"name_bn": "এমেস্ট্যাট ৮ মি.গ্রা. ট্যাবলেট", "generic_bn": "অনডানসেট্রন ৮ মি.গ্রা.", "pharma_bn": "ইনসেপ্টা ফার্মাসিউটিক্যালস"},
    "exium-mups-20": {"name_bn": "এক্সিয়াম মাপ্স ২০ ট্যাবলেট", "generic_bn": "এসোমিপ্রাজল ম্যাগনেসিয়াম ২০ মি.গ্রা.", "pharma_bn": "রেনেটা লিমিটেড"},
    "pantonix-20": {"name_bn": "প্যান্টোনিক্স ২০ ট্যাবলেট", "generic_bn": "প্যান্টোপ্রাজল সোডিয়াম ২০ মি.গ্রা.", "pharma_bn": "ইনসেপ্টা ফার্মাসিউটিক্যালস"},
    "doxiva-200-tablet": {"name_bn": "ডক্সিভা ২০০ ট্যাবলেট", "generic_bn": "ডক্সোফাইলিন ২০০ মি.গ্রা.", "pharma_bn": "বেক্সিমকো ফার্মাসিউটিক্যালস"},
    "alatrol-10": {"name_bn": "অ্যালাট্রোল ১০ ট্যাবলেট", "generic_bn": "সেটিরিজিন ডাইহাইড্রোক্লোরাইড ১০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "rivotril-0-5-tablet": {"name_bn": "রিভোট্রিল ০.৫ ট্যাবলেট", "generic_bn": "ক্লোনাজিপাম ০.৫ মি.গ্রা.", "pharma_bn": "রেডিয়েন্ট ফার্মাসিউটিক্যালস"},
    "naprosyn-500-tablet": {"name_bn": "ন্যাপ্রোসিন ৫০০ ট্যাবলেট", "generic_bn": "ন্যাপ্রোক্সেন ৫০০ মি.গ্রা.", "pharma_bn": "রেডিয়েন্ট ফার্মাসিউটিক্যালস"},
    "xinc-b-tablet": {"name_bn": "জিঙ্ক-বি ট্যাবলেট", "generic_bn": "জিঙ্ক সালফেট + ভিটামিন বি-কমপ্লেক্স", "pharma_bn": "একমি ল্যাবরেটরিজ"},
    "bilastine-20": {"name_bn": "বিলাস্টিন ২০ ট্যাবলেট", "generic_bn": "বিলাস্টিন ২০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "clas-75": {"name_bn": "ক্লাস ৭৫ ট্যাবলেট", "generic_bn": "ক্লোপিডোগ্রেল ৭৫ মি.গ্রা. + অ্যাসপিরিন ৭৫ মি.গ্রা.", "pharma_bn": "বেক্সিমকো ফার্মাসিউটিক্যালস"},
    "maxpro-20": {"name_bn": "ম্যাক্সপ্রো ২০ ক্যাপসুল", "generic_bn": "এসোমিপ্রাজল ২০ মি.গ্রা.", "pharma_bn": "রেনেটা লিমিটেড"},
    "normens-5": {"name_bn": "নরমেম্স ৫ ট্যাবলেট", "generic_bn": "নরইথিস্টেরন ৫ মি.গ্রা.", "pharma_bn": "রেনেটা লিমিটেড"},
    "bislol-2-5-tablet": {"name_bn": "বিসলোল ২.৫ ট্যাবলেট", "generic_bn": "বাইসোপ্রোলল ফিউমারেট ২.৫ মি.গ্রা.", "pharma_bn": "ইনসেপ্টা ফার্মাসিউটিক্যালস"},
    "alcet-5-tablet": {"name_bn": "আলসেট ৫ ট্যাবলেট", "generic_bn": "লেভোসেটিরিজিন ডাইহাইড্রোক্লোরাইড ৫ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "furoclav-500": {"name_bn": "ফিউরোক্ল্যাভ ৫০০ ট্যাবলেট", "generic_bn": "সেফুরোক্সিম ৫০০ মি.গ্রা. + ক্লাভুলানিক অ্যাসিড ১২৫ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "tufnil-200-tablet": {"name_bn": "টাফনিল ২০০ ট্যাবলেট", "generic_bn": "টোলফেনামিক অ্যাসিড ২০০ মি.গ্রা.", "pharma_bn": "এসকেএফ ফার্মাসিউটিক্যালস"},
    "zimax-500-tablet": {"name_bn": "জিম্যাক্স ৫০০ ট্যাবলেট", "generic_bn": "অ্যাজিথ্রোমাইসিন ডাইহাইড্রেট ৫০০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "bicozin-tablet": {"name_bn": "বিকোজিন ট্যাবলেট", "generic_bn": "ভিটামিন বি-কমপ্লেক্স ও জিঙ্ক", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "d-rise-40000iu": {"name_bn": "ডি-রাইজ ৪০,০০০ আইইউ ক্যাপসুল", "generic_bn": "কোলিক্যালসিফেরল (ভিটামিন ডি৩)", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "fenadin-120-tablet": {"name_bn": "ফেনাডিন ১২০ ট্যাবলেট", "generic_bn": "ফেক্সোফেনাডিন হাইড্রোক্লোরাইড ১২০ মি.গ্রা.", "pharma_bn": "রেনেটা লিমিটেড"},
    "e-cap-400-iu-capsule": {"name_bn": "ই-ক্যাপ ৪০০ আইইউ ক্যাপসুল", "generic_bn": "ভিটামিন ই (ডিএল-আলফা টোকোফেরল অ্যাসিটেট)", "pharma_bn": "ড্রাগ ইন্টারন্যাশনাল"},
    "fexo-120-tablet": {"name_bn": "ফেক্সো ১২০ ট্যাবলেট", "generic_bn": "ফেক্সোফেনাডিন হাইড্রোক্লোরাইড ১২০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "flexibac-10-mg": {"name_bn": "ফ্লেক্সিবেক ১০ মি.গ্রা. ট্যাবলেট", "generic_bn": "ব্যাক্লোফেন ১০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "cortan-20": {"name_bn": "করটান ২০ ট্যাবলেট", "generic_bn": "প্রেডনিসোলোন ২০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"},
    "ecosprin-75": {"name_bn": "ইকোস্প্রিন ৭৫ ট্যাবলেট", "generic_bn": "অ্যাসপিরিন ৭৫ মি.গ্রা.", "pharma_bn": "একমি ল্যাবরেটরিজ"},
    "rosutin-10": {"name_bn": "রোজুটিন ১০ ট্যাবলেট", "generic_bn": "রোসুভাস্টাটিন ক্যালসিয়াম ১০ মি.গ্রা.", "pharma_bn": "স্কয়ার ফার্মাসিউটিক্যালস"}
}

# Bengali URLs crawled map
with open('scripts/bn_links.json', encoding='utf-8') as f:
    bn_data = json.load(f)

bn_all_urls = bn_data.get('medical', []) + bn_data.get('dental', [])

def find_matching_bn_url(slug):
    slug_clean = slug.replace('-tablet', '').replace('-capsule', '').replace('-ointment', '').replace('-mg', '').replace('iu', '')
    for bn_u in bn_all_urls:
        bn_slug = bn_u.rstrip('/').split('/')[-1]
        if slug in bn_slug or slug_clean in bn_slug or bn_slug in slug:
            return bn_u
    return None

print(f"Starting master migration for all {len(URLS)} items...")

success_count = 0

for idx, url in enumerate(URLS):
    slug = url.rstrip('/').split('/')[-1]
    print(f"\n--- [{idx+1}/{len(URLS)}] Processing: {slug} ---")
    
    soup = fetch_soup(url)
    if not soup:
        print(f"Failed to fetch soup for {url}")
        continue
        
    entry = soup.find(class_=lambda c: c and any(x in c for x in ['entry-content', 'post-content', 'article-content', 'elementor-widget-theme-post-content'])) or soup.find('article')
    
    # 1. Clean Title & Name
    h1 = soup.find('h1')
    full_title = h1.get_text(strip=True) if h1 else soup.title.get_text(strip=True)
    clean_name = re.sub(r'[\:\–\-].*$', '', full_title).strip()
    clean_medicine_name = re.sub(r'(?:\s+Tablet|\s+Capsule|\s+Ointment|\s+Suspension)+$', '', clean_name, flags=re.IGNORECASE).strip()
    
    # 2. Extract authentic image
    img_url = find_best_image(soup)
    local_image = None
    if img_url:
        local_image = download_file(img_url, 'public/uploads/medicines')
        print(f"  Image: {img_url} -> {local_image}")
    else:
        print(f"  Warning: No image found for {url}")
        
    if not local_image:
        local_image = f"/uploads/medicines/{slug}.webp"
        
    # Ensure web path has NO /public/ prefix
    local_image = local_image.replace('/public/', '/')
    
    # 3. Clean full article HTML content
    seo_content = clean_html(entry, 'public/uploads/medicines') if entry else ""
    
    # 4. Meta description
    meta_desc = ""
    m = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
    if m:
        meta_desc = m.get('content', '').strip()
        
    # 5. FAQs
    faqs = extract_faqs(soup, entry)
    
    # 6. Generic & Pharma
    text_content = entry.get_text(separator="\n", strip=True) if entry else ""
    generic = ""
    gen_match = re.search(r'(?:containing|contains|generic name is|generic|composition[\s\:]+)\s*([A-Za-z0-9\s\+\-\(\)\%]+?(?:Hydrochloride|Sodium|Potassium|Phosphate|Sulphate|Tartrate|Citrate|Maleate|Fumarate|Hydrate|Tablet|Capsule|Ointment|Suspension|mg|IU)?)', text_content, re.IGNORECASE)
    if gen_match:
        generic = re.sub(r'(?:Tablet|Capsule|Ointment).*$', '', gen_match.group(1)).strip()
    if not generic or len(generic) < 3:
        generic = re.sub(r'\d+.*$', '', clean_name).strip()
        
    pharma = "Square Pharmaceuticals PLC"
    for brand in ["Square Pharmaceuticals", "Beximco Pharmaceuticals", "Incepta Pharmaceuticals", "Renata Limited", "Healthcare Pharmaceuticals", "Radiant Pharmaceuticals", "Eskayef Pharmaceuticals", "Aristopharma", "ACI Limited", "Opsonin Pharma", "Popular Pharmaceuticals", "The ACME Laboratories", "Drug International"]:
        if brand.lower() in text_content.lower():
            pharma = brand
            break
            
    # 7. Intro & Quick use
    paras = [p.get_text(strip=True) for p in entry.find_all('p') if len(p.get_text(strip=True)) > 40] if entry else []
    intro = paras[0] if paras else f"{clean_name} is a clinically trusted medication prescribed for dental and therapeutic healthcare."
    quick_use = paras[1][:120] + "..." if len(paras) > 1 else intro[:120] + "..."
    
    # 8. Uses items
    uses_items = []
    uses_text = f"{clean_name} is commonly prescribed for:"
    for h in (entry.find_all(['h2', 'h3']) if entry else []):
        if any(x in h.get_text().lower() for x in ['used for', 'uses', 'indications', 'what is']):
            curr = h.next_sibling
            while curr:
                if curr.name in ['h1', 'h2', 'h3']:
                    break
                if curr.name == 'ul':
                    for li in curr.find_all('li'):
                        txt = li.get_text(strip=True)
                        if ':' in txt:
                            p = txt.split(':', 1)
                            uses_items.append({'label': p[0].strip(), 'text': p[1].strip()})
                        else:
                            uses_items.append({'label': txt[:30], 'text': txt})
                    break
                elif curr.name == 'p' and len(curr.get_text(strip=True)) > 20:
                    uses_text = curr.get_text(strip=True)
                curr = curr.next_sibling
            break
            
    if not uses_items:
        uses_items = [
            {'label': 'Therapeutic Relief', 'text': f'Effective management of symptoms indicated for {clean_name}.'},
            {'label': 'Clinical Care', 'text': 'Fast acting symptom reduction as prescribed by physicians.'}
        ]
        
    # 9. Dosage
    dosage = "Take strictly as directed by a registered medical practitioner or dentist."
    dosage_admin = "Swallow the tablet whole with a full glass of water. Do not crush or chew."
    dosage_timing = "Take at regular intervals after meals as directed by your physician."
    
    # 10. Side effects
    side_effects = "Generally well tolerated when taken within recommended dosage. Common mild effects may include:"
    side_effects_items = [
        {'effect': 'Nausea / Mild Discomfort', 'freq': 'Uncommon', 'desc': 'Mild digestive upset may occur during the first days.'},
        {'effect': 'Drowsiness or Fatigue', 'freq': 'Rare', 'desc': 'Take adequate rest and drink sufficient water.'}
    ]
    
    # 11. Warnings
    warnings = [
        {'type': 'prescription', 'text': 'Prescription Only: Take strictly under medical guidance.'},
        {'type': 'liver_kidney', 'text': 'Consult your doctor if you have known kidney or liver impairment.'},
        {'type': 'pregnancy', 'text': 'Consult your physician before taking during pregnancy or breastfeeding.'}
    ]
    
    # 12. Pricing
    price_per_tablet = "৳ 5.00"
    price_per_strip = "৳ 50.00"
    p_match = re.search(r'(?:Unit Price|Per Tablet|Per Piece|Price per tablet)[\s\:\–\-]*([৳\$\d\.\,\s]+(?:BDT|TK|টাকা)?)', text_content, re.IGNORECASE)
    if p_match:
        price_per_tablet = "৳ " + re.sub(r'[^\d\.]', '', p_match.group(1))
        try:
            val = float(re.sub(r'[^\d\.]', '', p_match.group(1)))
            price_per_strip = f"৳ {val*10:.2f}"
        except:
            pass
            
    # 13. Bengali Crawling or Mapping
    bn_url = find_matching_bn_url(slug)
    name_bn = None
    generic_bn = None
    pharma_bn = None
    dosage_bn = None
    uses_text_bn = None
    side_effects_bn = None
    seo_content_bn = None
    seo_title_bn = f"More about {clean_medicine_name}"
    
    if bn_url:
        print(f"  Fetching BN page: {bn_url}...")
        bn_soup = fetch_soup(bn_url)
        if bn_soup:
            bn_h1 = bn_soup.find('h1')
            if bn_h1:
                name_bn = re.sub(r'[\:\–\-].*$', '', bn_h1.get_text(strip=True)).strip()
            bn_entry = bn_soup.find(class_=lambda c: c and any(x in c for x in ['entry-content', 'post-content'])) or bn_soup.find('article')
            if bn_entry:
                seo_content_bn = clean_html(bn_entry, 'public/uploads/medicines')
                bn_paras = [p.get_text(strip=True) for p in bn_entry.find_all('p') if len(p.get_text(strip=True)) > 30]
                if bn_paras:
                    intro_bn = bn_paras[0]
                    uses_text_bn = f"{name_bn or clean_name} এর প্রধান নির্দেশনাসমূহ:"
                dosage_bn = "রেজিস্টার্ড চিকিৎসকের পরামর্শ অনুযায়ী সেব্য।"
                side_effects_bn = "সাধারণত সহনশীল, তবে চিকিৎসকের নির্দেশিত মাত্রার অতিরিক্ত সেবন করা যাবে না।"
                
    # Check manual map fallback if still missing
    mapping = BN_MAPPINGS.get(slug, {})
    if not name_bn:
        name_bn = mapping.get('name_bn', clean_name)
    if not generic_bn:
        generic_bn = mapping.get('generic_bn', generic)
    if not pharma_bn:
        pharma_bn = mapping.get('pharma_bn', pharma)
    if not dosage_bn:
        dosage_bn = "রেজিস্টার্ড চিকিৎসক বা ডেন্টিস্টের পরামর্শ অনুযায়ী নির্ধারিত মাত্রায় সেবন করুন।"
    if not uses_text_bn:
        uses_text_bn = f"{name_bn} সাধারণ চিকিৎসার পাশাপাশি ডেন্টাল রোগীর ক্ষেত্রেও নির্ধারিত নির্দেশনায় ব্যবহৃত হয়।"
    if not side_effects_bn:
        side_effects_bn = "সাধারণত সহনশীল। অতিরিক্ত মাত্রায় সেবন করা থেকে বিরত থাকুন।"
    if not seo_content_bn:
        # Generate rich structured Bengali overview if no BN page existed on old site
        seo_content_bn = f"""
        <div class="space-y-4">
            <h2 class="text-xl font-bold text-slate-900">{name_bn} এর বিস্তারিত বিবরণ</h2>
            <p class="text-slate-700 leading-relaxed">{name_bn} একটি অত্যন্ত কার্যকর ও বহুল ব্যবহৃত ওষুধ। এটি মূলত {generic_bn} সমৃদ্ধ যা রোগীদের উপসর্গ দ্রুত উপশমে সহায়তা করে। প্রস্তুতকারক: {pharma_bn}।</p>
            <h3 class="text-lg font-bold text-slate-800 mt-4">ব্যবহারের নির্দেশিকা</h3>
            <p class="text-slate-700 leading-relaxed">{uses_text_bn}</p>
            <h3 class="text-lg font-bold text-slate-800 mt-4">সেবনবিধি ও সতর্কতা</h3>
            <p class="text-slate-700 leading-relaxed">{dosage_bn} গর্ভাবস্থা বা কিডনি জটিলতা থাকলে সেবনের পূর্বে অবশ্যই চিকিৎসকের সাথে পরামর্শ নিন।</p>
        </div>
        """

    # 14. Upsert into medicines table
    cursor.execute('SELECT id FROM medicines WHERE slug = ?', (slug,))
    existing = cursor.fetchone()
    
    if existing:
        med_id = existing['id']
        cursor.execute('''
            UPDATE medicines SET
                name = ?, name_bn = ?, generic = ?, generic_bn = ?,
                pharma = ?, pharma_bn = ?, image = ?,
                quick_use = ?, quick_use_bn = ?,
                dosage = ?, dosage_bn = ?,
                uses_text = ?, uses_text_bn = ?, uses_items = ?,
                dosage_admin = ?, dosage_admin_bn = ?, dosage_timing = ?,
                side_effects = ?, side_effects_bn = ?, side_effects_items = ?,
                warnings = ?, price_per_tablet = ?, price_per_strip = ?, price_manufacturer = ?,
                faqs = ?, seo_title = ?, seo_title_bn = ?,
                seo_content = ?, seo_content_bn = ?, meta_desc = ?,
                canonical_url = ?, is_active = 1, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (
            clean_name, name_bn, generic, generic_bn,
            pharma, pharma_bn, local_image,
            quick_use, intro_bn if 'intro_bn' in locals() and intro_bn else uses_text_bn,
            dosage, dosage_bn,
            uses_text, uses_text_bn, json.dumps(uses_items, ensure_ascii=False),
            dosage_admin, "এক গ্লাস পানির সাথে সম্পূর্ণ ট্যাবলেট গিলে ফেলুন। খালি পেটে সেবন করবেন না।", dosage_timing,
            side_effects, side_effects_bn, json.dumps(side_effects_items, ensure_ascii=False),
            json.dumps(warnings, ensure_ascii=False), price_per_tablet, price_per_strip, pharma,
            json.dumps(faqs, ensure_ascii=False), f"More about {clean_medicine_name}", f"More about {clean_medicine_name}",
            seo_content, seo_content_bn, meta_desc,
            url, med_id
        ))
        print(f"  [OK] Updated medicine #{med_id}: {clean_name}")
    else:
        cursor.execute('''
            INSERT INTO medicines (
                slug, name, name_bn, generic, generic_bn,
                category, tag, image,
                quick_use, quick_use_bn, pharma, pharma_bn,
                dosage, dosage_bn, dental_usage,
                uses_text, uses_text_bn, uses_items,
                dosage_admin, dosage_admin_bn, dosage_timing,
                side_effects, side_effects_bn, side_effects_items,
                warnings, price_per_tablet, price_per_strip, price_manufacturer,
                faqs, seo_title, seo_title_bn,
                seo_content, seo_content_bn, meta_desc,
                canonical_url, is_active, sort_order, created_at, updated_at
            ) VALUES (
                ?, ?, ?, ?, ?,
                'general', '', ?,
                ?, ?, ?, ?,
                ?, ?, 'ডেন্টাল চিকিৎসা ও সার্বিক থেরাপিউটিক নির্দেশনায় চিকিৎসকের পরামর্শে ব্যবহৃত হয়।',
                ?, ?, ?,
                ?, 'এক গ্লাস পানির সাথে সম্পূর্ণ ট্যাবলেট গিলে ফেলুন। খালি পেটে সেবন করবেন না।', ?,
                ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?,
                ?, ?, ?,
                ?, 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            )
        ''', (
            slug, clean_name, name_bn, generic, generic_bn,
            local_image,
            quick_use, intro_bn if 'intro_bn' in locals() and intro_bn else uses_text_bn, pharma, pharma_bn,
            dosage, dosage_bn,
            uses_text, uses_text_bn, json.dumps(uses_items, ensure_ascii=False),
            dosage_admin, dosage_timing,
            side_effects, side_effects_bn, json.dumps(side_effects_items, ensure_ascii=False),
            json.dumps(warnings, ensure_ascii=False), price_per_tablet, price_per_strip, pharma,
            json.dumps(faqs, ensure_ascii=False), f"More about {clean_medicine_name}", f"More about {clean_medicine_name}",
            seo_content, seo_content_bn, meta_desc,
            url
        ))
        print(f"  [OK] Inserted new medicine: {clean_name}")
        
    conn.commit()
    success_count += 1

print(f"\nCompleted! Total processed and saved to medicines: {success_count}/{len(URLS)}")

