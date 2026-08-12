import urllib.request
import json

# Test Wikipedia API for Hindi films of 2023
url = "https://en.wikipedia.org/w/api.php?action=parse&page=List_of_Hindi_films_of_2023&format=json&prop=text"
headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        html = data['parse']['text']['*']
        print("Wikipedia HTML length:", len(html))
        # Check if table is present
        print("Table count:", html.count("<table"))
except Exception as e:
    print("Error:", e)
