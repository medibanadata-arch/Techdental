import sqlite3
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT content_bn FROM posts WHERE id = 5")
row = cursor.fetchone()
if row and row[0]:
    content_bn = row[0]
    idx = content_bn.find("bracess-before-after")
    print("Found in content_bn:", idx)
    if idx != -1:
        print(content_bn[idx-150:idx+400])

