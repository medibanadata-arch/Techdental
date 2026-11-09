import sqlite3, json

conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT warnings, uses_items FROM medicines WHERE slug = 'gum-cancer-symptoms-causes'")
row = cursor.fetchone()
print("gum-cancer warnings:", row[0])
print("gum-cancer uses_items:", row[1])
