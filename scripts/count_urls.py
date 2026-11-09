import re

with open('scripts/run_migration.py', encoding='utf-8') as f:
    text = f.read()

urls = [u for u in re.findall(r'https://techdentalcare\.com/[^\s\'",]+', text) if '/wp-content/' not in u]
urls = list(dict.fromkeys(urls))
print(f"Unique non-media URLs in run_migration.py: {len(urls)}")
for u in urls[:10]:
    print(" ", u)
