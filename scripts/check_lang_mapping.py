import urllib.request
from bs4 import BeautifulSoup

def get_post_info(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        title = soup.find('h1')
        title_text = title.get_text(strip=True) if title else ""
        
        # Check alternates / language switcher
        alternates = {}
        for link in soup.find_all('link', rel='alternate'):
            if link.get('hreflang'):
                alternates[link['hreflang']] = link.get('href')
                
        # Also check any a tag with class or text bn / en
        header_lang = {}
        for a in soup.find_all('a', href=True):
            if 'বাংলা' in a.get_text() or 'English' in a.get_text():
                header_lang[a.get_text(strip=True)] = a['href']
                
        return {
            'url': url,
            'title': title_text,
            'alternates': alternates,
            'header_lang': header_lang
        }
    except Exception as e:
        return {'url': url, 'error': str(e)}

print("EN chennai:", get_post_info("https://techdentalcare.com/dental/best-dental-clinic-in-chennai/"))
print("BN cavity:", get_post_info("https://techdentalcare.com/bn/dentistry/tooth-cavity-home-remedies/"))
print("EN ortho:", get_post_info("https://techdentalcare.com/dental/best-orthodontist-doctor-in-dhaka/"))
print("BN ortho:", get_post_info("https://techdentalcare.com/bn/dentistry/orthodontic-centre-tech-dental/"))

