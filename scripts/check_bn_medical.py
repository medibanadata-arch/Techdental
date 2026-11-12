import json

with open('scripts/bn_links.json', encoding='utf-8') as f:
    data = json.load(f)

print("Medical links count:", len(data.get('medical', [])))
for u in data.get('medical', [])[:10]:
    print(" ", u)

