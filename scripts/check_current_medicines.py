import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute('SELECT id, slug, name, pharma, dosage, price_per_tablet FROM medicines')
rows = c.fetchall()
print(f"Total medicines in DB: {len(rows)}")
for r in rows:
    print(r)

