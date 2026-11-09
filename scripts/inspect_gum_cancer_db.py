import sqlite3, json

conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, uses_items, warnings, side_effects_items FROM medicines WHERE slug = 'gum-cancer-symptoms-causes'")
row = cursor.fetchone()
print("gum-cancer-symptoms-causes:")
print("uses_items:", row[2])
print("warnings:", row[3])
print("side_effects_items:", row[4])
