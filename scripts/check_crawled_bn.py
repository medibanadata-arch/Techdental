import json

with open('scripts/all_crawled_category_urls.json', encoding='utf-8') as f:
    data = json.load(f)

print("medical_en count:", len(data['medical_en']))
print("medical_bn count:", len(data['medical_bn']))
print("\nFirst 10 medical_bn:")
for u in data['medical_bn'][:10]:
    print(" ", u)

