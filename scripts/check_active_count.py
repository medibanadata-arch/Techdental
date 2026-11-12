import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute("SELECT count(*) FROM medicines WHERE is_active = 1")
active = c.fetchone()[0]
c.execute("SELECT count(*) FROM medicines")
total = c.fetchone()[0]
print(f"Active: {active} / {total}")

