import sqlite3
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT content_bn FROM posts WHERE id = 5")
c = cursor.fetchone()[0]
idx = c.find("bracess-before-after")
print(c[idx-300:idx+1000])
