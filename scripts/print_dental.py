import json

with open('scripts/all_crawled_category_urls.json', encoding='utf-8') as f:
    data = json.load(f)

print("dental_en:")
for u in data['dental_en']:
    print(" ", u)

print("\ndental_bn:")
for u in data['dental_bn']:
    print(" ", u)
