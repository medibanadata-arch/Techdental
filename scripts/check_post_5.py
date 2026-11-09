import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

row = c.execute("SELECT id, title, content FROM posts WHERE slug = 'best-orthodontist-doctor-in-dhaka'").fetchone()
if row:
    print("Found post:")
    content = row[2]
    idx = content.find("Ashraful Hashem")
    if idx != -1:
        print(content[idx-100:idx+600])
    else:
        print("Ashraful Hashem not found in content")

