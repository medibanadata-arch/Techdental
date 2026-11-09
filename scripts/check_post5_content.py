import sqlite3
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT content FROM posts WHERE id = 5")
content = cursor.fetchone()[0]

idx = content.find("pictures of his work are given below")
if idx != -1:
    print(content[idx-50:idx+800])
