import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute('SELECT count(*) FROM medicines')
total = c.fetchone()[0]
c.execute("SELECT count(*) FROM medicines WHERE faqs IS NULL OR faqs = '' OR faqs = '[]'")
empty = c.fetchone()[0]
print(f"Total medicines: {total}, Empty FAQs: {empty}")

