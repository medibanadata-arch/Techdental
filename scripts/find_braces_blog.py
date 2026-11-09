import sqlite3
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, title FROM blogs WHERE content LIKE '%Ashraful Hashem%' OR content LIKE '%pictures of his work%'")
rows = cursor.fetchall()
print("Found in blogs:", rows)

