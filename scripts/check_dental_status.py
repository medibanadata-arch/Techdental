import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute("SELECT id, slug, title, title_bn, img, category, category_id, status FROM posts")
rows = c.fetchall()
print(f"Total posts: {len(rows)}")
for r in rows:
    print(r[0], r[1], "| EN:", r[2][:30] if r[2] else None, "| BN:", r[3][:30] if r[3] else None, "| CAT:", r[5], "| ID:", r[6], "| STATUS:", r[7])

