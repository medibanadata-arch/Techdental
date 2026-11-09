import sqlite3, os
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, name, image FROM medicines")
rows = cursor.fetchall()
missing_in_public = []
found_in_public = []
for r in rows:
    img = r[3]
    if img:
        rel = img.lstrip('/')
        # check public/
        full_path = os.path.join('public', rel)
        if os.path.exists(full_path):
            found_in_public.append((r[1], img))
        else:
            missing_in_public.append((r[1], img))
    else:
        missing_in_public.append((r[1], 'NO_IMAGE'))

print(f"Total: {len(rows)}")
print(f"Found in public/: {len(found_in_public)}")
print(f"Missing in public/: {len(missing_in_public)}")
for m in missing_in_public:
    print('Missing:', m)

