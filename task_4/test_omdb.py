import urllib.request
import json

keys = ["thewdb", "727299a9", "b9bd48a6", "57248386"]
for k in keys:
    url = f"http://www.omdbapi.com/?t=Jawan&y=2023&apikey={k}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data.get('Response') == 'True':
                print(f"Working OMDB key: {k}")
                print(f"Title: {data.get('Title')}, Year: {data.get('Year')}, IMDb Rating: {data.get('imdbRating')}, Poster: {data.get('Poster')}")
                break
            else:
                print(f"Key {k} response false:", data)
    except Exception as e:
        print(f"Key {k} error:", e)
