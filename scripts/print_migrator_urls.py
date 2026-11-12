from migrator_base import URLS

print(f"Total URLS in migrator_base: {len(URLS)}")
for idx, u in enumerate(URLS):
    slug = u.rstrip('/').split('/')[-1]
    print(f"{idx+1}: {slug} -> {u}")

