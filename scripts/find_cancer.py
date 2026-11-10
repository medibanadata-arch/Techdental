import sqlite3
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, name, name_bn FROM medicines WHERE slug LIKE '%cancer%' OR name LIKE '%cancer%' OR name_bn LIKE '%ক্যান্সার%'")
print("In medicines:", cursor.fetchall())
cursor.execute("SELECT id, slug, title, title_bn FROM posts WHERE slug LIKE '%cancer%' OR title LIKE '%cancer%' OR title_bn LIKE '%ক্যান্সার%'")
print("In posts:", cursor.fetchall())

