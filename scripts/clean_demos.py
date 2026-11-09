import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

# Update id=1 to use the real image and real data if needed
c.execute("UPDATE medicines SET image = '/uploads/medicines/Alatrol-10-mg-Tablet-Box-and-Blister-Strip.webp' WHERE id = 1")

# Delete the demo duplicate items with placeholders (keeping real migrated ones)
demo_ids = [2, 4, 5, 7, 9, 10, 13, 15]
c.execute(f"DELETE FROM medicines WHERE id IN ({','.join(map(str, demo_ids))})")
conn.commit()

# Also check if there are any other placeholders in medicines
remaining = c.execute("SELECT id, name, slug, image FROM medicines WHERE image LIKE '%placehold%'").fetchall()
print(f"Remaining placeholders: {len(remaining)}")

total = c.execute("SELECT COUNT(*) FROM medicines").fetchone()[0]
print(f"Total active medicines in database: {total}")

