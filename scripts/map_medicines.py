import json
import urllib.request
from bs4 import BeautifulSoup
import re

with open('scripts/live_medicine_urls.json', encoding='utf-8') as f:
    data = json.load(f)

en_urls = data['en']
bn_urls = data['bn']

print("EN 49 slugs:")
en_slugs = [u.rstrip('/').split('/')[-1] for u in en_urls]
print(en_slugs)

print("\nBN 49 slugs:")
bn_slugs = [u.rstrip('/').split('/')[-1] for u in bn_urls]
print(bn_slugs)

