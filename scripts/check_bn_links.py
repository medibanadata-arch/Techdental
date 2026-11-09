import json

with open('scripts/bn_links.json', encoding='utf-8') as f:
    data = json.load(f)

print(f"Medical ({len(data.get('medical', []))}):")
for u in data.get('medical', []):
    print(" ", u)

print(f"Dental ({len(data.get('dental', []))}):")
for u in data.get('dental', []):
    print(" ", u)
