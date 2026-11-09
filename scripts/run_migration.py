import os
import sys
import re
import json
import sqlite3
import urllib.request
import urllib.parse
from bs4 import BeautifulSoup
import time

from migrator_base import URLS, HEADERS, fetch_html, download_image, extract_faqs_from_entry

conn = sqlite3.connect('database/database.sqlite')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Get existing medicine template for defaults
cursor.execute('SELECT * FROM medicines WHERE id = 1')
med_template = dict(cursor.fetchone())

# Identify demo posts to delete (keep id=1)
cursor.execute('DELETE FROM medicines WHERE id IN (16, 17) OR name LIKE "%demo%" OR name LIKE "%amin%" OR slug LIKE "%amin%"')
conn.commit()

report = {
    'total': len(URLS),
    'medicines_migrated': 0,
    'posts_migrated': 0,
    'images_downloaded': 0,
    'faqs_migrated': 0,
    'successful_urls': [],
    'failed_urls': []
}

def clean_elementor_html(content_elem, base_url, folder='public/uploads/medicines'):
    # Remove unwanted elementor wrappers, social share buttons, etc.
    for tag in content_elem.find_all(class_=lambda c: c and any(x in c for x in ['elementor-share-buttons', 'elementor-social-icons', 'post-info', 'author-box', 'comments-area'])):
        tag.decompose()
        
    # Remove FAQ section from HTML body so FAQs live exclusively in dedicated FAQ section
    faq_heading = None
    for h in content_elem.find_all(['h2', 'h3']):
        txt = h.get_text().lower()
        if 'faq' in txt or 'frequently asked' in txt or 'সাধারণ জিজ্ঞাসা' in txt:
            faq_heading = h
            break
            
    if faq_heading:
        curr = faq_heading
        elements_to_remove = [curr]
        while curr.next_sibling:
            curr = curr.next_sibling
            if curr.name in ['h1', 'h2'] and not any(k in curr.get_text().lower() for k in ['faq', 'frequently', 'branch', 'opening', 'services']):
                break
            elements_to_remove.append(curr)
        for el in elements_to_remove:
            if hasattr(el, 'decompose'):
                el.decompose()

    # Also remove "Our Branch", "Popular Services", "Opening Hours" footer widgets from content
    for h in content_elem.find_all(['h2', 'h3']):
        txt = h.get_text().lower().strip()
        if any(w in txt for w in ['our branch', 'popular services', 'opening hours', 'tech dental clinics']):
            curr = h
            elems = [curr]
            while curr.next_sibling:
                curr = curr.next_sibling
                elems.append(curr)
            for el in elems:
                if hasattr(el, 'decompose'):
                    el.decompose()
            break

    # Download and replace images
    for img in content_elem.find_all('img'):
        src = img.get('data-src') or img.get('src')
        if src and not src.startswith('data:'):
            if src.startswith('/'):
                src = 'https://techdentalcare.com' + src
            local_src = download_image(src, folder)
            if local_src:
                img['src'] = local_src
                report['images_downloaded'] += 1
            if img.has_attr('srcset'):
                del img['srcset']
            if img.has_attr('data-src'):
                del img['data-src']
            img['class'] = 'rounded-2xl my-4 mx-auto shadow-sm max-w-full h-auto object-cover'
            img['loading'] = 'lazy'

    # Clean styling
    for tag in content_elem.find_all(True):
        if tag.has_attr('style'):
            # keep text-align if any, strip elementor fixed widths
            s = tag['style']
            if 'width' in s and 'px' in s:
                del tag['style']

    return str(content_elem)

def parse_medicine(url, soup, entry):
    slug = url.rstrip('/').split('/')[-1]
    
    # Title & clean name
    h1 = soup.find('h1')
    full_title = h1.get_text(strip=True) if h1 else soup.title.get_text(strip=True)
    clean_name = re.sub(r'[\:\–\-].*$', '', full_title).strip()
    
    # Meta description
    meta_desc = ""
    m = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
    if m:
        meta_desc = m.get('content', '').strip()
        
    seo_title = full_title
    
    # Featured image
    og_img = soup.find('meta', attrs={'property': 'og:image'})
    feat_src = og_img.get('content', '') if og_img else ''
    local_image = download_image(feat_src, 'public/uploads/medicines') if feat_src else None
    
    # Extract FAQs
    faqs = extract_faqs_from_entry(soup, entry)
    
    # Text content analysis
    text_content = entry.get_text(separator="\n", strip=True)
    
    # Generic extraction
    generic = ""
    gen_match = re.search(r'(?:containing|contains|generic name is|generic|composition[\s\:]+)\s*([A-Za-z0-9\s\+\-\(\)\%]+?(?:Hydrochloride|Sodium|Potassium|Phosphate|Sulphate|Tartrate|Citrate|Maleate|Fumarate|Hydrate|Tablet|Capsule|Ointment|Suspension|mg|IU)?)', text_content, re.IGNORECASE)
    if gen_match:
        generic = gen_match.group(1).strip()
        generic = re.sub(r'(?:Tablet|Capsule|Ointment).*$', '', generic).strip()
    if not generic or len(generic) < 3:
        # Fallback to name without strength
        generic = re.sub(r'\d+.*$', '', clean_name).strip()
        
    # Pharma extraction
    pharma = "Square Pharma PLC"
    for brand in ["Square Pharmaceuticals", "Square Pharma", "Beximco Pharmaceuticals", "Beximco Pharma", "Incepta Pharmaceuticals", "Incepta Pharma", "Renata Limited", "Healthcare Pharmaceuticals", "Radiant Pharmaceuticals", "Eskayef Pharmaceuticals", "SK+F", "Aristopharma", "ACI Limited", "Opsonin Pharma", "Popular Pharmaceuticals"]:
        if brand.lower() in text_content.lower():
            pharma = brand
            break

    # Intro & Quick use
    paragraphs = [p.get_text(strip=True) for p in entry.find_all('p') if len(p.get_text(strip=True)) > 40]
    intro = paragraphs[0] if paragraphs else f"{clean_name} is a clinically trusted medication used for dental and general therapeutic care."
    quick_use = paragraphs[1][:120] + "..." if len(paragraphs) > 1 else intro[:120] + "..."
    
    # Uses Items
    uses_items = []
    uses_h2 = None
    for h2 in entry.find_all('h2'):
        if 'used for' in h2.get_text().lower() or 'uses' in h2.get_text().lower() or 'indications' in h2.get_text().lower():
            uses_h2 = h2
            break
            
    uses_text = f"{clean_name} is commonly prescribed for:"
    if uses_h2:
        curr = uses_h2.next_sibling
        while curr:
            if curr.name in ['h1', 'h2']:
                break
            if curr.name == 'ul':
                for li in curr.find_all('li'):
                    txt = li.get_text(strip=True)
                    if ':' in txt:
                        parts = txt.split(':', 1)
                        uses_items.append({'label': parts[0].strip(), 'text': parts[1].strip()})
                    else:
                        uses_items.append({'label': txt[:30], 'text': txt})
                break
            elif curr.name == 'p' and len(curr.get_text(strip=True)) > 20:
                uses_text = curr.get_text(strip=True)
            curr = curr.next_sibling
            
    if not uses_items:
        uses_items = [
            {'label': 'Therapeutic Relief', 'text': f'Effective management of symptoms indicated for {clean_name}.'},
            {'label': 'Clinical Indication', 'text': 'Fast acting symptom reduction as prescribed by physicians.'}
        ]

    # Dosage
    dosage = "Take strictly as directed by a registered medical practitioner or dentist."
    dosage_admin = "Swallow the tablet/capsule whole with a full glass of water. Do not crush or chew."
    dosage_timing = "Take at regular intervals as recommended by your healthcare provider."
    
    dosage_h2 = None
    for h2 in entry.find_all('h2'):
        if 'dosage' in h2.get_text().lower() or 'administration' in h2.get_text().lower():
            dosage_h2 = h2
            break
            
    if dosage_h2:
        curr = dosage_h2.next_sibling
        d_paras = []
        while curr:
            if curr.name in ['h1', 'h2']:
                break
            if curr.name == 'p' and len(curr.get_text(strip=True)) > 15:
                d_paras.append(curr.get_text(strip=True))
            elif curr.name == 'ul':
                for li in curr.find_all('li'):
                    d_paras.append(li.get_text(strip=True))
            curr = curr.next_sibling
        if d_paras:
            dosage = d_paras[0]
            if len(d_paras) > 1:
                dosage_admin = d_paras[1]
            if len(d_paras) > 2:
                dosage_timing = d_paras[2]

    # Side Effects
    side_effects = f"{clean_name} is generally well tolerated, but mild side effects may occasionally occur:"
    side_effects_items = []
    
    side_h2 = None
    for h2 in entry.find_all('h2'):
        if 'side effect' in h2.get_text().lower():
            side_h2 = h2
            break
            
    if side_h2:
        curr = side_h2.next_sibling
        while curr:
            if curr.name in ['h1', 'h2']:
                break
            if curr.name == 'ul':
                for li in curr.find_all('li'):
                    side_effects_items.append(li.get_text(strip=True))
                break
            elif curr.name == 'p':
                txt = curr.get_text(strip=True)
                if len(txt) > 20:
                    side_effects = txt
            curr = curr.next_sibling
            
    if not side_effects_items:
        side_effects_items = ["Mild nausea or gastrointestinal discomfort", "Headache or mild fatigue", "Dizziness in sensitive patients"]

    # Warnings
    warnings = [
        {"icon": "triangle-exclamation", "label": "Prescription Only", "text": "Take strictly under medical guidance."},
        {"icon": "shield-halved", "label": "Kidney & Liver Care", "text": "Consult physician if you have chronic medical conditions."},
        {"icon": "triangle-exclamation", "label": "Pregnancy & Lactation", "text": "Consult your doctor before taking during pregnancy or breastfeeding."}
    ]
    
    # Prices
    price_per_tablet = "৳ 5.00"
    price_per_strip = "৳ 50.00"
    
    price_match = re.search(r'(?:Unit Price|Per Tablet|Per Piece|Price per tablet)[\s\:\–\-]*([৳\$\d\.\,\s]+(?:BDT|TK|টাকা)?)', text_content, re.IGNORECASE)
    if price_match:
        price_per_tablet = "৳ " + re.sub(r'[^\d\.]', '', price_match.group(1))
        try:
            val = float(re.sub(r'[^\d\.]', '', price_match.group(1)))
            price_per_strip = f"৳ {val*10:.2f}"
        except:
            pass

    # Clean HTML body for SEO accordion
    clean_body = clean_elementor_html(entry, url, 'public/uploads/medicines')
    
    return {
        'slug': slug,
        'name': clean_name,
        'generic': generic,
        'category': 'general',
        'tag': '',
        'image': local_image or 'https://placehold.co/600x400/f1f5f9/64748b?text=' + urllib.parse.quote(clean_name),
        'quick_use': quick_use,
        'pharma': pharma,
        'dosage': dosage,
        'dental_usage': f"Used in dental therapy for post-procedure symptom relief and oral infection/pain management.",
        'uses_text': uses_text,
        'uses_items': json.dumps(uses_items, ensure_ascii=False),
        'dosage_admin': dosage_admin,
        'dosage_timing': dosage_timing,
        'side_effects': side_effects,
        'side_effects_items': json.dumps(side_effects_items, ensure_ascii=False),
        'warnings': json.dumps(warnings, ensure_ascii=False),
        'price_per_tablet': price_per_tablet,
        'price_per_strip': price_per_strip,
        'price_manufacturer': pharma,
        'faqs': json.dumps(faqs, ensure_ascii=False),
        'seo_title': seo_title,
        'meta_desc': meta_desc,
        'canonical_url': url,
        'seo_content': clean_body,
        'is_active': 1,
        'sort_order': 0,
        'published_date': 'Updated 2026'
    }

def parse_post(url, soup, entry):
    slug = url.rstrip('/').split('/')[-1]
    
    h1 = soup.find('h1')
    title = h1.get_text(strip=True) if h1 else soup.title.get_text(strip=True)
    
    meta_desc = ""
    m = soup.find('meta', attrs={'name': 'description'}) or soup.find('meta', attrs={'property': 'og:description'})
    if m:
        meta_desc = m.get('content', '').strip()
        
    og_img = soup.find('meta', attrs={'property': 'og:image'})
    feat_src = og_img.get('content', '') if og_img else ''
    local_image = download_image(feat_src, 'public/uploads/posts') if feat_src else None
    
    faqs = extract_faqs_from_entry(soup, entry)
    
    # Category detection
    cat = "Dental"
    if 'case-study' in url:
        cat = "Case Study"
    elif 'centres' in url or 'center' in url:
        cat = "Specialized Centres"
    elif 'physician' in url:
        cat = "Doctors & Clinics"
    elif 'tech-physio' in url:
        cat = "Healthcare News"
        
    # Clean HTML body
    clean_body = clean_elementor_html(entry, url, 'public/uploads/posts')
    
    # Excerpt
    paras = [p.get_text(strip=True) for p in entry.find_all('p') if len(p.get_text(strip=True)) > 40]
    excerpt = paras[0][:160] + "..." if paras else meta_desc[:160]
    
    return {
        'slug': slug,
        'title': title,
        'excerpt': excerpt,
        'content': clean_body,
        'img': local_image or '/uploads/posts/default-blog.webp',
        'thumb_url': local_image or '/uploads/posts/default-blog.webp',
        'category': cat,
        'author_name': 'Tech Dental Specialist Team',
        'author_avatar': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
        'published_at': '2026-01-15 10:00:00',
        'status': 'published',
        'faqs': json.dumps(faqs, ensure_ascii=False) if faqs else None,
        'seo_title': title,
        'meta_desc': meta_desc,
        'canonical_url': url,
        'breadcrumb_title': title[:30] + '...' if len(title) > 30 else title
    }

print("Migration runner initialized.")

# Execution Loop
print(f"Starting migration of {len(URLS)} URLs...")

for idx, url in enumerate(URLS):
    slug = url.rstrip('/').split('/')[-1]
    is_medicine = '/medicine/' in url
    
    print(f"\n[{idx+1}/{len(URLS)}] Fetching: {url} ({'Medicine' if is_medicine else 'Post'})...")
    html = fetch_html(url)
    if not html:
        print(f"FAILED to fetch {url}")
        report['failed_urls'].append(url)
        continue
        
    soup = BeautifulSoup(html, 'html.parser')
    entry = soup.find(class_=lambda c: c and any(x in c for x in ['entry-content', 'post-content', 'article-content', 'elementor-widget-theme-post-content']))
    if not entry:
        entry = soup.find('article')
        
    if not entry:
        print(f"No content entry found for {url}")
        report['failed_urls'].append(url)
        continue

    try:
        if is_medicine:
            med_data = parse_medicine(url, soup, entry)
            # Check if medicine with this slug exists
            cursor.execute('SELECT id FROM medicines WHERE slug = ?', (med_data['slug'],))
            existing = cursor.fetchone()
            
            if existing:
                # Update existing medicine
                med_id = existing['id']
                cursor.execute('''
                    UPDATE medicines SET
                        name = ?, generic = ?, category = ?, tag = ?, image = ?,
                        quick_use = ?, pharma = ?, dosage = ?, dental_usage = ?,
                        uses_text = ?, uses_items = ?, dosage_admin = ?, dosage_timing = ?,
                        side_effects = ?, side_effects_items = ?, warnings = ?,
                        price_per_tablet = ?, price_per_strip = ?, price_manufacturer = ?,
                        faqs = ?, seo_title = ?, meta_desc = ?, canonical_url = ?, seo_content = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ''', (
                    med_data['name'], med_data['generic'], med_data['category'], med_data['tag'], med_data['image'],
                    med_data['quick_use'], med_data['pharma'], med_data['dosage'], med_data['dental_usage'],
                    med_data['uses_text'], med_data['uses_items'], med_data['dosage_admin'], med_data['dosage_timing'],
                    med_data['side_effects'], med_data['side_effects_items'], med_data['warnings'],
                    med_data['price_per_tablet'], med_data['price_per_strip'], med_data['price_manufacturer'],
                    med_data['faqs'], med_data['seo_title'], med_data['meta_desc'], med_data['canonical_url'], med_data['seo_content'],
                    med_id
                ))
                print(f"Updated medicine ID {med_id}: {med_data['name']}")
            else:
                # Insert new medicine
                cursor.execute('''
                    INSERT INTO medicines (
                        slug, name, generic, category, tag, image,
                        quick_use, pharma, dosage, dental_usage,
                        uses_text, uses_items, dosage_admin, dosage_timing,
                        side_effects, side_effects_items, warnings,
                        price_per_tablet, price_per_strip, price_manufacturer,
                        faqs, seo_title, meta_desc, canonical_url, seo_content,
                        is_active, sort_order, created_at, updated_at
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?,
                        ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                    )
                ''', (
                    med_data['slug'], med_data['name'], med_data['generic'], med_data['category'], med_data['tag'], med_data['image'],
                    med_data['quick_use'], med_data['pharma'], med_data['dosage'], med_data['dental_usage'],
                    med_data['uses_text'], med_data['uses_items'], med_data['dosage_admin'], med_data['dosage_timing'],
                    med_data['side_effects'], med_data['side_effects_items'], med_data['warnings'],
                    med_data['price_per_tablet'], med_data['price_per_strip'], med_data['price_manufacturer'],
                    med_data['faqs'], med_data['seo_title'], med_data['meta_desc'], med_data['canonical_url'], med_data['seo_content']
                ))
                print(f"Inserted new medicine: {med_data['name']}")
                
            report['medicines_migrated'] += 1
            if med_data['faqs']:
                report['faqs_migrated'] += len(json.loads(med_data['faqs']))
        else:
            # Blog / Case Study / Clinic Guide
            post_data = parse_post(url, soup, entry)
            cursor.execute('SELECT id FROM posts WHERE slug = ?', (post_data['slug'],))
            existing = cursor.fetchone()
            
            if existing:
                post_id = existing['id']
                cursor.execute('''
                    UPDATE posts SET
                        title = ?, excerpt = ?, content = ?, img = ?, thumb_url = ?,
                        category = ?, author_name = ?, author_avatar = ?,
                        faqs = ?, seo_title = ?, meta_desc = ?, canonical_url = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                ''', (
                    post_data['title'], post_data['excerpt'], post_data['content'], post_data['img'], post_data['thumb_url'],
                    post_data['category'], post_data['author_name'], post_data['author_avatar'],
                    post_data['faqs'], post_data['seo_title'], post_data['meta_desc'], post_data['canonical_url'],
                    post_id
                ))
                print(f"Updated post ID {post_id}: {post_data['title']}")
            else:
                cursor.execute('''
                    INSERT INTO posts (
                        slug, title, excerpt, content, img, thumb_url,
                        category, author_name, author_avatar, published_at,
                        status, faqs, seo_title, meta_desc, canonical_url,
                        breadcrumb_title, created_at, updated_at
                    ) VALUES (
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?,
                        ?, ?, ?, ?, ?,
                        ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                    )
                ''', (
                    post_data['slug'], post_data['title'], post_data['excerpt'], post_data['content'], post_data['img'], post_data['thumb_url'],
                    post_data['category'], post_data['author_name'], post_data['author_avatar'], post_data['published_at'],
                    post_data['status'], post_data['faqs'], post_data['seo_title'], post_data['meta_desc'], post_data['canonical_url'],
                    post_data['breadcrumb_title']
                ))
                print(f"Inserted new post: {post_data['title']}")
                
            report['posts_migrated'] += 1
            if post_data['faqs']:
                report['faqs_migrated'] += len(json.loads(post_data['faqs']))

        conn.commit()
        report['successful_urls'].append(url)
    except Exception as e:
        print(f"Error migrating {url}: {e}")
        report['failed_urls'].append(url)

# Save final report
with open('scripts/migration_report.json', 'w', encoding='utf-8') as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

print("\n================ MIGRATION FINISHED ================")
print(f"Total Processed: {len(URLS)}")
print(f"Successful: {len(report['successful_urls'])}")
print(f"Failed: {len(report['failed_urls'])}")
print(f"Medicines Migrated: {report['medicines_migrated']}")
print(f"Posts Migrated: {report['posts_migrated']}")
print(f"Images Downloaded: {report['images_downloaded']}")
print(f"FAQs Migrated: {report['faqs_migrated']}")
