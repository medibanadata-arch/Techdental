import sqlite3
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, name, generic, is_active FROM medicines WHERE slug = 'call-center-jobs'")
print(cursor.fetchall())

