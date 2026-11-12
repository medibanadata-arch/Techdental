import sqlite3
import json

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute('SELECT count(*) FROM medicines WHERE is_active = 1')
print('Active medicines:', c.fetchone()[0])
c.execute('SELECT count(*) FROM medicines WHERE is_active = 1 AND length(faqs) > 5')
print('Active with FAQs:', c.fetchone()[0])
c.execute("SELECT slug, name, name_bn, faqs FROM medicines WHERE slug = 'napa-500mg'")
row = c.fetchone()
print('Napa row:', row[0], '|', row[1], '|', row[2])
faqs = json.loads(row[3])
print(f'Napa FAQs count: {len(faqs)}')
for f in faqs:
    print('  EN Q:', f.get('q'))
    print('  EN A:', f.get('a')[:60] if f.get('a') else None)
    print('  BN Q:', f.get('q_bn'))
    print('  BN A:', f.get('a_bn')[:60] if f.get('a_bn') else None)

