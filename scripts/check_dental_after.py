import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute("SELECT id, slug, title, title_bn, img, length(faqs) FROM posts WHERE category = 'Dental'")
for r in c.fetchall():
    print(r)

