import json

with open('scripts/probe_manifest.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

print("=== 49 MEDICINE POSTS ===")
for it in items:
    if it['is_medicine']:
        print(f"{it['index']:02d}: {it['slug']} ({it['url']})")

print("\n=== 33 NON-MEDICINE POSTS ===")
for it in items:
    if not it['is_medicine']:
        print(f"{it['index']:02d}: {it['slug']} ({it['url']})")

