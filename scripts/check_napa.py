import sqlite3, os
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, name, image FROM medicines WHERE slug = 'napa-500mg'")
row = cursor.fetchone()
print("Napa row:", row)
if row and row[3]:
    p = 'public' + row[3]
    print(f"Path {p} exists? {os.path.exists(p)}, size: {os.path.getsize(p) if os.path.exists(p) else 0}")

