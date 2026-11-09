import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

row = c.execute("SELECT id, title, content FROM posts WHERE slug = 'best-orthodontist-doctor-in-dhaka'").fetchone()
content = row[2]
idx = content.find("Some pictures of his work")
if idx != -1:
    print(content[idx:idx+1500])
else:
    print("Not found")

