import sqlite3
import json

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute("SELECT id, slug, name FROM medicines WHERE id >= 61 ORDER BY id")
rows = c.fetchall()

print(f"Total items >= 61: {len(rows)}")
for r in rows:
    print(r[0], r[1])

