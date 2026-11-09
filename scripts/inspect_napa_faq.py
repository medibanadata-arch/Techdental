import urllib.request

req = urllib.request.Request("https://techdentalcare.com/medicine/napa-500mg/", headers={"User-Agent": "Mozilla/5.0"})
html = urllib.request.urlopen(req).read().decode("utf-8")
idx = html.find("Frequently Asked Questions")
print("INDEX:", idx)
if idx != -1:
    print(html[idx-100:idx+2500])
else:
    print("Not found")
