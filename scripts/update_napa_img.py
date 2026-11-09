import sqlite3
conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("UPDATE medicines SET image = '/uploads/medicines/Napa-500mg-Paracetamol-Tablet-Box-and-Blister-Strip.webp' WHERE slug = 'napa-500mg'")
conn.commit()
print("Updated napa-500mg image!")

