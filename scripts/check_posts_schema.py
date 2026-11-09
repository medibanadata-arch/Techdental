import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute("PRAGMA table_info(posts)")
cols = [row[1] for row in c.fetchall()]
print("Posts columns count:", len(cols))
print("title_bn in cols?", 'title_bn' in cols)
print("content_bn in cols?", 'content_bn' in cols)
print("excerpt_bn in cols?", 'excerpt_bn' in cols)
for col in cols:
    if '_bn' in col:
        print("  bn col:", col)

