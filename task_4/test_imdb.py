import urllib.request
import json
import re

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9'
}

req = urllib.request.Request('https://www.imdb.com/search/title/?title_type=feature&primary_language=hi&release_date=2023-01-01,2023-12-31&sort=user_rating,desc', headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        print("Fetched successfully, length:", len(html))
        # Look for JSON-LD or initial data
        matches = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.DOTALL)
        print("JSON-LD blocks found:", len(matches))
        for m in matches:
            if 'itemListElement' in m or 'Movie' in m:
                print("Found match snippet:", m[:300])
except Exception as e:
    print("Error:", e)
