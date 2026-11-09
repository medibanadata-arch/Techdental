import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute("PRAGMA table_info(medicines)")
cols = c.fetchall()
print("Medicines columns:")
for col in cols:
    print(f"  {col[1]} ({col[2]})")
