import sqlite3, json

conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, uses_items, warnings, side_effects_items FROM medicines")
rows = cursor.fetchall()
uses_with_bn = 0
warnings_with_bn = 0
side_effects_with_bn = 0

for r in rows:
    uses = json.loads(r[2]) if r[2] and r[2].strip().startswith('[') else []
    warn = json.loads(r[3]) if r[3] and r[3].strip().startswith('[') else []
    side = json.loads(r[4]) if r[4] and r[4].strip().startswith('[') else []
    
    if any(isinstance(u, dict) and ('label_bn' in u or 'text_bn' in u) for u in uses):
        uses_with_bn += 1
    if any(isinstance(w, dict) and ('label_bn' in w or 'text_bn' in w) for w in warn):
        warnings_with_bn += 1
    if any(isinstance(s, dict) and 'text_bn' in s for s in side):
        side_effects_with_bn += 1

print(f"uses_items with bn: {uses_with_bn} / {len(rows)}")
print(f"warnings with bn: {warnings_with_bn} / {len(rows)}")
print(f"side_effects_items with bn: {side_effects_with_bn} / {len(rows)}")

