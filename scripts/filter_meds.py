import sqlite3
import json

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

# Get all medicines
c.execute("SELECT id, slug, name FROM medicines")
meds = c.fetchall()

with open('scripts/all_medical_archive_en.json', 'w') as f:
    pass

print(f"Total current in medicines table: {len(meds)}")
non_meds = []
real_meds = []
for m in meds:
    slug = m[1]
    # Check if this slug was from dental/case-study/update/physician
    if any(k in slug for k in ['case-study', 'dental-implant', 'orthodontist', 'dentist', 'clinic', 'call-center', 'tech-physio', 'sterilization', 'farewell', 'rights', 'dermatologist', 'toothache', 'wisdom-tooth', 'gum-cancer', 'bad-breath', 'smile-design', 'special-needs']):
        non_meds.append(m)
    else:
        real_meds.append(m)

print(f"Real medicines: {len(real_meds)}")
print(f"Non-medicine items in medicines table: {len(non_meds)}")
for nm in non_meds:
    print("  Non-med:", nm)

