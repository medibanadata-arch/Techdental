import sqlite3

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()
c.execute("""
    UPDATE posts SET 
        title = '5 Home Remedies to Reduce Tooth Cavities and Cost-Effective Solutions',
        excerpt = 'When tooth enamel decays and small holes form, we call it tooth cavity or dental caries. Discover effective remedies and preventive care.'
    WHERE id = 99
""")
conn.commit()
print("Post 99 updated")

