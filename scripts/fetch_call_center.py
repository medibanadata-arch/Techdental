import urllib.request
import json
from bs4 import BeautifulSoup

url = "https://techdentalcare.com/medicine/call-center-jobs/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        soup = BeautifulSoup(resp.read().decode('utf-8', errors='ignore'), 'html.parser')
        img = soup.find('article')
        img_tag = soup.find('img')
        print("Title:", soup.find('title'))
        print("Img tag:", img_tag)
except Exception as e:
    print("Error:", e)
