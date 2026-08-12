import urllib.request
import urllib.parse
import json
import time

# A carefully selected list of real Bollywood (Hindi) movies by year
movie_titles_by_year = {
    "2025": [
        "Chhaava", "Sky Force", "Emergency", "Devara Part 1", "Bad Newz", "Maidaan"
    ],
    "2024": [
        "Stree 2", "Fighter", "Shaitaan", "Chandu Champion", "Crew", "Munjya", 
        "Article 370", "Bhakshak", "Merry Christmas", "Kill", "Srikanth", "Lapataa Ladies"
    ],
    "2023": [
        "Jawan", "Pathaan", "Animal", "Dunki", "Gadar 2", "OMG 2", 
        "Rocky Aur Rani Kii Prem Kahaani", "Sam Bahadur", "12th Fail", "Tu Jhoothi Main Makkaar",
        "The Kerala Story", "Satyaprem Ki Katha"
    ],
    "2022": [
        "Drishyam 2", "The Kashmir Files", "Bhool Bhulaiyaa 2", "Gangubai Kathiawadi",
        "Brahmastra Part One: Shiva", "Vikram Vedha", "Bhediya", "Major", "Uunchai",
        "Rocketry: The Nambi Effect"
    ],
    "2021": [
        "Shershaah", "Sooryavanshi", "83", "Chandigarh Kare Aashiqui", "Antim: The Final Truth",
        "Sardar Udham", "Mimi", "Master"
    ],
    "2020": [
        "Tanhaji: The Unsung Warrior", "Dil Bechara", "Ludo", "Thappad", "Chhapaak",
        "Shakuntala Devi", "Gunjan Saxena: The Kargil Girl"
    ],
    "2019": [
        "War", "Kabir Singh", "Uri: The Surgical Strike", "Gully Boy", "Chhichhore",
        "Good Newwz", "Super 30", "Mission Mangal", "Bala", "Article 15"
    ],
    "2018": [
        "Sanju", "Andhadhun", "Tumbbad", "Stree", "Raazi", "Badhaai Ho",
        "Padmaavat", "Ratsasan", "Laila Majnu"
    ]
}

accurate_movies = []

headers = {'User-Agent': 'Mozilla/5.0'}

for year, titles in movie_titles_by_year.items():
    print(f"Fetching {year} movies...")
    for title in titles:
        encoded = urllib.parse.quote(title)
        url = f"http://www.omdbapi.com/?t={encoded}&y={year}&apikey=thewdb"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if data.get('Response') == 'True':
                    rating_str = data.get('imdbRating', 'N/A')
                    if rating_str != 'N/A':
                        try:
                            rating = float(rating_str)
                        except ValueError:
                            continue
                    else:
                        continue
                    
                    poster = data.get('Poster')
                    if not poster or poster == 'N/A':
                        continue
                    
                    actual_year = data.get('Year', year)
                    try:
                        parsed_year = int(actual_year[:4])
                    except:
                        parsed_year = int(year)

                    movie_obj = {
                        "title": data.get('Title'),
                        "year": parsed_year,
                        "rating": rating,
                        "poster": poster,
                        "genre": data.get('Genre', 'Bollywood'),
                        "director": data.get('Director', 'N/A')
                    }
                    accurate_movies.append(movie_obj)
                    print(f"  ✓ Added: {movie_obj['title']} ({movie_obj['year']}) - IMDb {movie_obj['rating']}")
                else:
                    # Try without year restriction if not found
                    url_no_year = f"http://www.omdbapi.com/?t={encoded}&apikey=thewdb"
                    req2 = urllib.request.Request(url_no_year, headers=headers)
                    with urllib.request.urlopen(req2) as resp2:
                        data2 = json.loads(resp2.read().decode('utf-8'))
                        if data2.get('Response') == 'True' and data2.get('Poster') != 'N/A':
                            rating_str = data2.get('imdbRating', 'N/A')
                            if rating_str != 'N/A':
                                movie_obj = {
                                    "title": data2.get('Title'),
                                    "year": int(data2.get('Year', year)[:4]),
                                    "rating": float(rating_str),
                                    "poster": data2.get('Poster'),
                                    "genre": data2.get('Genre', 'Bollywood'),
                                    "director": data2.get('Director', 'N/A')
                                }
                                accurate_movies.append(movie_obj)
                                print(f"  ✓ Added (fallback): {movie_obj['title']} ({movie_obj['year']}) - IMDb {movie_obj['rating']}")
        except Exception as e:
            print(f"  ✗ Error fetching {title}: {e}")
        time.sleep(0.1)

print(f"\nTotal verified movies fetched: {len(accurate_movies)}")

with open("movies.json", "w") as f:
    json.dump(accurate_movies, f, indent=2)

print("Saved clean accurate movies to movies.json")
