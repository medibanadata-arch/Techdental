import sqlite3
import json

conn = sqlite3.connect('database/database.sqlite')
conn.row_factory = sqlite3.Row
c = conn.cursor()
c.execute('SELECT * FROM medicines WHERE id = 1')
row = dict(c.fetchone())

print("=== TEMPLATE MEDICINE (ID 1: Alatrol 10mg) ===")
for k, v in row.items():
    if isinstance(v, str) and (v.startswith('[') or v.startswith('{')):
        try:
            parsed = json.loads(v)
            print(f"{k} (JSON): {json.dumps(parsed, indent=2)[:200]}...")
        except:
            print(f"{k}: {str(v)[:100]}")
    else:
        print(f"{k}: {str(v)[:100] if v is not None else 'None'}")

