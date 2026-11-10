import sqlite3

conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT COUNT(*) FROM medicines WHERE name_bn IS NOT NULL AND name_bn != ''")
print("Medicines with name_bn:", cursor.fetchone()[0])
cursor.execute("SELECT id, slug, name, name_bn FROM medicines WHERE name_bn IS NULL OR name_bn = ''")
rows = cursor.fetchall()
print("Medicines without name_bn:", len(rows))
for r in rows:
    print(r)

