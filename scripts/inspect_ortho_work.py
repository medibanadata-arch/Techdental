import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

row = c.execute("SELECT id, content FROM posts WHERE slug = 'best-orthodontist-doctor-in-dhaka'").fetchone()
if row:
    content = row[1]
    start = content.find("Some pictures of his work are given below:")
    if start != -1:
        end = content.find("Tech Dental Care Braces Price List 2026", start)
        print("FOUND SECTION:")
        print(content[start:end+50])

