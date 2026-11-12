import json
import re

with open('scripts/live_medicine_urls.json', encoding='utf-8') as f:
    data = json.load(f)

en_urls = data['en']
bn_urls = data['bn']

def clean_slug(s):
    s = s.lower()
    for drop in ['-tablet', '-capsule', '-ointment', '-suspension', '-mg', 'iu', '-bd', 'bn-']:
        s = s.replace(drop, '')
    return s.strip('-')

mappings = []
unmatched_bn = list(bn_urls)

for en in en_urls:
    en_slug = en.rstrip('/').split('/')[-1]
    en_clean = clean_slug(en_slug)
    matched_bn = None
    for bn in unmatched_bn:
        bn_slug = bn.rstrip('/').split('/')[-1]
        bn_clean = clean_slug(bn_slug)
        if en_clean == bn_clean or en_clean in bn_clean or bn_clean in en_clean:
            matched_bn = bn
            break
    if matched_bn:
        unmatched_bn.remove(matched_bn)
        mappings.append({'en_url': en, 'en_slug': en_slug, 'bn_url': matched_bn, 'bn_slug': matched_bn.rstrip('/').split('/')[-1]})
    else:
        mappings.append({'en_url': en, 'en_slug': en_slug, 'bn_url': None, 'bn_slug': None})

print(f"Matched {len([m for m in mappings if m['bn_url']])} out of {len(mappings)}")
for m in mappings:
    print(f"{m['en_slug']}  <===>  {m['bn_slug']}")

if unmatched_bn:
    print("\nRemaining BN urls:")
    for u in unmatched_bn:
        print(" ", u)

