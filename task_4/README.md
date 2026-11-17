# 🎬 Task 4: Bollywood Hits — Dynamic Movie Catalog Grouped by Year

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement asynchronous JSON data fetching via the Fetch API, higher-order array grouping algorithms (`reduce`), multi-criteria sorting, and dynamic card generation with live search filtering.

---

## 💡 Key JavaScript Concepts Demonstrated
* **Asynchronous Data Retrieval (Fetch API):**
  * Fetching `movies.json` dynamically and handling promise resolution.
* **Array Grouping & Processing (`reduce`):**
  * Grouping an array of movie objects into nested collections categorized by release year.
* **Array Sorting (`sort`):**
  * Ordering movies within each annual cluster descending by user rating.
* **Dynamic DOM Injection & Live Search:**
  * Constructing poster cards with title, genre, director, and IMDb rating badges.
  * Real-time search filter listening to `input` events.

---

## 🚀 Key Features
* Glassmorphic cinema UI with ambient background glow.
* Year-by-year accordion / section dividers.
* Instant client-side search filtering across hundreds of film titles.

---

## 📁 Folder Structure
```text
task_4/
├── index.html       # Cinema catalog interface
├── app.js           # Fetch API, grouping logic, and search filter
├── movies.json      # Structured Bollywood movie dataset
├── style.css        # Modern glassmorphic cinema styles
└── README.md        # Task documentation
```

---

## 🛠️ How to Run
1. Open `task_4` in **VS Code**.
2. Run `index.html` via **Live Server** (required for `fetch('movies.json')`).
