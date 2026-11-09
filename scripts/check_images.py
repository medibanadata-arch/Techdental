import sqlite3, os
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, name, image FROM medicines")
rows = cursor.fetchall()
missing_files = []
for r in rows:
    img = r[3]
    if img:
        # local path
        local_path = img.lstrip('/')
        if not os.path.exists(local_path):
            missing_files.append((r[1], img))
    else:
        missing_files.append((r[1], 'NO_IMAGE'))

print(f"Total medicines: {len(rows)}")
print(f"Missing image files on disk: {len(missing_files)}")
for m in missing_files[:20]:
    print(m)

