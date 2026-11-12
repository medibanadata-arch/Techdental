import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute("SELECT id, slug, name, name_bn FROM medicines ORDER BY id")
rows = c.fetchall()
print(f"Total medicines: {len(rows)}")
for r in rows:
    print(f"{r[0]}: {r[1]} | EN: {r[2]} | BN: {r[3]}")

