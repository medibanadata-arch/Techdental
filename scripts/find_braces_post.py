import sqlite3
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, title FROM posts WHERE content LIKE '%Ashraful Hashem%' OR content LIKE '%pictures of his work%'")
rows = cursor.fetchall()
print("Found in posts:", rows)
for r in rows:
    cursor.execute("SELECT content FROM posts WHERE id = ?", (r[0],))
    content = cursor.fetchone()[0]
    idx = content.find("pictures of his work")
    if idx != -1:
        print("--- CONTENT SNIPPET ---")
        print(content[idx:idx+1500])
