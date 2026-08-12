import urllib.request
import json

# Test TMDb API with a public demo key
key = "3fd2be69867786078d8f85f31481b4d0"
url = f"https://api.themoviedb.org/3/discover/movie?api_key={key}&with_original_language=hi&primary_release_year=2023&sort_by=vote_average.desc&vote_count.gte=10"

headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        print("TMDb Total Results for 2023 Hindi:", data.get('total_results'))
        if data.get('results'):
            for m in data['results'][:5]:
                print(f"Title: {m['title']}, Year: {m['release_date'][:4]}, Rating: {m['vote_average']}, Poster: https://image.tmdb.org/t/p/w500{m['poster_path']}")
except Exception as e:
    print("TMDb Error:", e)
