from migrator_base import URLS

print(f"Total URLs in migrator_base.py: {len(URLS)}")
for i, u in enumerate(URLS):
    print(f"{i+1}: {u}")
