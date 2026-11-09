import sqlite3
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, name, generic, image FROM medicines WHERE slug LIKE '%amin%' OR name LIKE '%amin%'")
rows = cursor.fetchall()
print(f"Found {len(rows)} matching amin:")
for r in rows:
    print(r)

# Check all medicines where image is empty or placeholder or dummy
cursor.execute("SELECT id, slug, name, image FROM medicines WHERE image IS NULL OR image = '' OR image LIKE '%placeholder%'")
dummy = cursor.fetchall()
print(f"Medicines with empty/null/placeholder image: {len(dummy)}")
for d in dummy[:10]:
    print(d)

