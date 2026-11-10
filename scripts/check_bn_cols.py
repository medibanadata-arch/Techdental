import sqlite3

conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()
cols = ['generic_bn', 'pharma_bn', 'intro_bn', 'dosage_bn', 'dosage_admin_bn', 'dosage_timing_bn', 'uses_text_bn', 'side_effects_bn', 'seo_content_bn']
for c in cols:
    cursor.execute(f"SELECT COUNT(*) FROM medicines WHERE {c} IS NOT NULL AND {c} != ''")
    cnt = cursor.fetchone()[0]
    print(f"{c}: {cnt} / 83")

