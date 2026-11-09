import sqlite3, json

conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cursor.execute("SELECT id, slug, warnings, uses_items FROM medicines")
rows = cursor.fetchall()
all_warning_texts = set()
all_use_labels = set()

for r in rows:
    try:
        w_list = json.loads(r[2]) if r[2] and r[2].strip().startswith('[') else []
        for w in w_list:
            if isinstance(w, dict) and 'text' in w:
                all_warning_texts.add(w['text'])
    except:
        pass
    try:
        u_list = json.loads(r[3]) if r[3] and r[3].strip().startswith('[') else []
        for u in u_list:
            if isinstance(u, dict) and 'label' in u:
                all_use_labels.add(u['label'])
    except:
        pass

print("Distinct warning texts:", len(all_warning_texts))
for w in list(all_warning_texts)[:10]:
    print(" -", repr(w))

print("\nDistinct use labels:", len(all_use_labels))
for u in list(all_use_labels)[:10]:
    print(" -", repr(u))
