import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

total = c.execute("SELECT COUNT(*) FROM medicines").fetchone()[0]
bad_public = c.execute("SELECT COUNT(*) FROM medicines WHERE image LIKE '%/public/%'").fetchone()[0]
placeholders = c.execute("SELECT COUNT(*) FROM medicines WHERE image LIKE '%placehold%'").fetchone()[0]

print(f"Total medicines: {total}")
print(f"Bad /public/ prefix: {bad_public}")
print(f"Placeholders: {placeholders}")

if bad_public > 0:
    c.execute("UPDATE medicines SET image = REPLACE(image, '/public/', '/') WHERE image LIKE '%/public/%'")
    conn.commit()
    print("Cleaned up bad /public/ paths in medicines.")

