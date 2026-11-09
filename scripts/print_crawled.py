import json

with open('scripts/all_crawled_category_urls.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"medical_bn count: {len(data['medical_bn'])}")
for u in data['medical_bn']:
    print(u)
