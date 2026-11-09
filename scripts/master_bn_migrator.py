import os
import re
import json
import time
import sqlite3
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup

from migrator_base import HEADERS
from master_migration_base import download_file, fetch_soup, clean_html, extract_faqs

conn = sqlite3.connect('database/database.sqlite')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Load all crawled URLs
with open('scripts/all_crawled_category_urls.json', encoding='utf-8') as f:
    crawled = json.load(f)

medical_bn_urls = [u for u in crawled['medical_bn'] if not u.endswith('/blog/dental/')]
dental_bn_urls = [u for u in crawled['dental_bn'] if not u.endswith('/blog/dental/') and not u.endswith('/dental/')]

print(f"Total medical BN URLs to process: {len(medical_bn_urls)}")
print(f"Total dental BN URLs to process: {len(dental_bn_urls)}")

# Fetch all medicines from DB
cursor.execute('SELECT id, slug, name, generic, pharma, seo_title, faqs FROM medicines')
medicines = [dict(r) for r in cursor.fetchall()]

# Map helper to find medicine in DB for a given BN URL
def find_matching_medicine(bn_url, bn_title, bn_text):
    bn_slug = bn_url.rstrip('/').split('/')[-1].lower()
    # Normalize slug
    clean_bn_slug = re.sub(r'^(?:bn-|medication-|dentistry-)', '', bn_slug)
    clean_bn_slug = re.sub(r'-(?:bd|tablet|capsule|ointment|mg)$', '', clean_bn_slug)
    clean_bn_slug = clean_bn_slug.replace('-', '')
    
    # 1. Exact or partial slug match
    for m in medicines:
        m_slug = m['slug'].replace('-', '')
        if clean_bn_slug in m_slug or m_slug in clean_bn_slug:
            return m
            
    # 2. Match by medicine name keywords
    for m in medicines:
        clean_m_name = re.sub(r'[^a-zA-Z0-9]', '', m['name']).lower()
        if len(clean_m_name) >= 3 and clean_m_name in bn_slug.replace('-', ''):
            return m
            
    # 3. Match by generic keywords in text
    for m in medicines:
        if m['generic'] and len(m['generic']) > 4:
            gen_clean = m['generic'].split()[0].lower()
            if gen_clean in bn_text.lower():
                return m
                
    return None

print("\n--- Crawling & Updating All Bengali Medicine Posts ---")

matched_count = 0

for idx, bn_url in enumerate(medical_bn_urls):
    print(f"\n[{idx+1}/{len(medical_bn_urls)}] Fetching BN: {bn_url}...")
    soup = fetch_soup(bn_url)
    if not soup:
        print(f"  Failed to fetch soup for {bn_url}")
        continue
        
    entry = soup.find(class_=lambda c: c and any(x in c for x in ['entry-content', 'post-content', 'article-content', 'elementor-widget-theme-post-content'])) or soup.find('article')
    if not entry:
        print(f"  No content entry found for {bn_url}")
        continue
        
    h1 = soup.find('h1')
    full_bn_title = h1.get_text(strip=True) if h1 else soup.title.get_text(strip=True)
    clean_bn_name = re.sub(r'[\:\–\-].*$', '', full_bn_title).strip()
    
    bn_text = entry.get_text(separator="\n", strip=True)
    
    med = find_matching_medicine(bn_url, clean_bn_name, bn_text)
    if not med:
        print(f"  Could not match {bn_url} ({clean_bn_name}) to existing medicine. Searching by slug fragment...")
        frag = bn_url.rstrip('/').split('/')[-1].split('-')[0]
        for m in medicines:
            if frag in m['slug']:
                med = m
                break
                
    if not med:
        print(f"  NO MATCH in DB for {bn_url}")
        continue
        
    print(f"  Matched to Medicine ID #{med['id']} ({med['name']} / {med['slug']})")
    matched_count += 1
    
    # Extract rich Bengali content for the More About drawer
    seo_content_bn = clean_html(entry, 'public/uploads/medicines')
    
    # Extract headings and paras
    paras = [p.get_text(strip=True) for p in entry.find_all('p') if len(p.get_text(strip=True)) > 20]
    intro_bn = paras[0] if paras else f"{clean_bn_name} একটি বিশ্বস্ত এবং বহুল ব্যবহৃত ঔষধ।"
    
    # Extract indications / uses
    uses_text_bn = f"{clean_bn_name} প্রধানত যেসব রোগের চিকিৎসায় ব্যবহৃত হয়:"
    for h in entry.find_all(['h2', 'h3']):
        h_txt = h.get_text().lower()
        if any(w in h_txt for w in ['ব্যবহৃত হয়', 'ব্যবহার', 'নির্দেশনা', 'কী কাজে']):
            curr = h.next_sibling
            while curr:
                if curr.name in ['h1', 'h2', 'h3']:
                    break
                if curr.name == 'p' and len(curr.get_text(strip=True)) > 20:
                    uses_text_bn = curr.get_text(strip=True)
                    break
                curr = curr.next_sibling
            break
            
    # Extract dosage
    dosage_bn = "চিকিৎসকের পরামর্শ অনুযায়ী সেবন করুন।"
    dosage_admin_bn = "এক গ্লাস পানির সাথে সম্পূর্ণ ট্যাবলেট গিলে ফেলুন। খালি পেটে সেবন করবেন না।"
    for h in entry.find_all(['h2', 'h3']):
        h_txt = h.get_text().lower()
        if any(w in h_txt for w in ['সেবন মাত্রা', 'মাত্রা', 'ডোজ', 'dosage']):
            curr = h.next_sibling
            while curr:
                if curr.name in ['h1', 'h2', 'h3']:
                    break
                if curr.name == 'p' and len(curr.get_text(strip=True)) > 15:
                    dosage_bn = curr.get_text(strip=True)
                    break
                curr = curr.next_sibling
            break
            
    # Extract side effects
    side_effects_bn = "সাধারণত সহনশীল, তবে মাত্রাতিরিক্ত সেবনে পার্শ্বপ্রতিক্রিয়া দেখা দিতে পারে।"
    for h in entry.find_all(['h2', 'h3']):
        h_txt = h.get_text().lower()
        if any(w in h_txt for w in ['পার্শ্বপ্রতিক্রিয়া', 'পার্শ্ব প্রতিক্রিয়া', 'side effect']):
            curr = h.next_sibling
            while curr:
                if curr.name in ['h1', 'h2', 'h3']:
                    break
                if curr.name == 'p' and len(curr.get_text(strip=True)) > 15:
                    side_effects_bn = curr.get_text(strip=True)
                    break
                curr = curr.next_sibling
            break
            
    # Extract FAQs
    bn_faqs = extract_faqs(soup, entry)
    
    # Update existing faqs with Bengali translations if available
    final_faqs = []
    if med['faqs']:
        try:
            curr_faqs = json.loads(med['faqs'])
            for i, f in enumerate(curr_faqs):
                f_item = dict(f)
                if i < len(bn_faqs):
                    f_item['q_bn'] = bn_faqs[i]['q']
                    f_item['a_bn'] = bn_faqs[i]['a']
                final_faqs.append(f_item)
        except:
            final_faqs = bn_faqs
    else:
        final_faqs = bn_faqs
        
    seo_title_bn = f"{clean_bn_name} সম্পর্কে আরো"
    
    # Generic & pharma in Bengali
    generic_bn = None
    gen_m = re.search(r'(?:জেনেরিক|উপাদান|সংমিশ্রণ|generic)[\s\:\–\-]*([^\.\n\r]+)', bn_text, re.IGNORECASE)
    if gen_m:
        generic_bn = gen_m.group(1).strip()[:100]
        
    pharma_bn = None
    for brand in ["বেক্সিমকো ফার্মাসিউটিক্যালস", "স্কয়ার ফার্মাসিউটিক্যালস", "ইনসেপ্টা ফার্মাসিউটিক্যালস", "রেনেটা লিমিটেড", "হেলথকেয়ার ফার্মাসিউটিক্যালস", "রেডিয়েন্ট ফার্মাসিউটিক্যালস", "এসকেএফ ফার্মাসিউটিক্যালস", "এরিস্টোফার্মা", "এসিআই লিমিটেড", "অপসোনিন ফার্মা", "পপুলার ফার্মাসিউটিক্যালস", "একমি ল্যাবরেটরিজ", "ড্রাগ ইন্টারন্যাশনাল"]:
        if brand in bn_text:
            pharma_bn = brand
            break
            
    cursor.execute('''
        UPDATE medicines SET
            name_bn = COALESCE(?, name_bn),
            generic_bn = COALESCE(?, generic_bn),
            pharma_bn = COALESCE(?, pharma_bn),
            intro_bn = ?,
            quick_use_bn = ?,
            uses_text_bn = ?,
            dosage_bn = ?,
            dosage_admin_bn = ?,
            side_effects_bn = ?,
            seo_title_bn = ?,
            seo_content_bn = ?,
            faqs = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (
        clean_bn_name,
        generic_bn,
        pharma_bn,
        intro_bn,
        intro_bn[:150] + "...",
        uses_text_bn,
        dosage_bn,
        dosage_admin_bn,
        side_effects_bn,
        seo_title_bn,
        seo_content_bn,
        json.dumps(final_faqs, ensure_ascii=False) if final_faqs else med['faqs'],
        med['id']
    ))
    conn.commit()
    print(f"  [UPDATED] Medicine #{med['id']} ({clean_bn_name}) successfully updated!")

print(f"\nFinished matching and updating {matched_count} medicines from Bengali pages!")

# Ensure all remaining medicines have consistent seo_title_bn = '{name_bn || name} সম্পর্কে আরো'
cursor.execute("SELECT id, name, name_bn FROM medicines")
all_meds = cursor.fetchall()
for m in all_meds:
    clean_n = m['name_bn'] or m['name']
    clean_n = re.sub(r'(?:\s+Tablet|\s+Capsule|\s+Ointment|\s+ট্যাবলেট|\s+ক্যাপসুল|\s+মলম)+$', '', clean_n, flags=re.IGNORECASE).strip()
    title_bn = f"{clean_n} সম্পর্কে আরো"
    cursor.execute("UPDATE medicines SET seo_title_bn = ? WHERE id = ?", (title_bn, m['id']))
conn.commit()
print("All medicines updated with consistent '... সম্পর্কে আরো' SEO title!")
