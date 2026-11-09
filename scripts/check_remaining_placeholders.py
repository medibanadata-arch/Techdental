import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

for r in c.execute("SELECT id, name, slug, image FROM medicines WHERE image LIKE '%placehold%'"):
    print(r)
