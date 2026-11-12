import urllib.request
from bs4 import BeautifulSoup
import json
import re

with open('scripts/all_medical_archive_en.json', 'w') as f:
    pass

# We already fetched en_meds and bn_meds in get_all_medical_archive.py
# Let's import that function and run it to get exact list of 49 medicines
from get_all_medical_archive import get_all_archive_urls

en_med_urls = get_all_archive_urls("https://techdentalcare.com/blog-en/medical/")
bn_med_urls = get_all_archive_urls("https://techdentalcare.com/bn/blog/medical/")

print(f"EN meds count: {len(en_med_urls)}")
print(f"BN meds count: {len(bn_med_urls)}")

# Save them to a json file
with open('scripts/live_medicine_urls.json', 'w', encoding='utf-8') as f:
    json.dump({'en': en_med_urls, 'bn': bn_med_urls}, f, indent=2)

print("Saved to scripts/live_medicine_urls.json")

