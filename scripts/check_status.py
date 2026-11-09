import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

print("Posts with ortho:")
for r in c.execute("SELECT id, title, slug FROM posts WHERE slug LIKE '%ortho%'"):
    print(r)

print("\nMedicines with ortho:")
for r in c.execute("SELECT id, name, slug FROM medicines WHERE slug LIKE '%ortho%'"):
    print(r)

