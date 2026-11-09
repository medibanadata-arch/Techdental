import urllib.request, sqlite3, os

url = "https://techdentalcare.com/wp-content/uploads/2023/12/lhfgujsfdhg.png"
out_path = "public/uploads/medicines/call-center-jobs.png"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        with open(out_path, 'wb') as f:
            f.write(resp.read())
    print("Downloaded successfully:", out_path)
    
    conn = sqlite3.connect("database/database.sqlite")
    cursor = conn.cursor()
    cursor.execute("UPDATE medicines SET image = ? WHERE slug = 'call-center-jobs'", ('/uploads/medicines/call-center-jobs.png',))
    conn.commit()
    print("Database updated!")
except Exception as e:
    print("Error:", e)

