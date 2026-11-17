# 🌐 Practical 10: Developer Portfolio & Asynchronous API Telemetry Engine

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement Asynchronous JavaScript using both the native Fetch API and jQuery `$.getJSON()` to retrieve remote API data and render a dynamic developer directory with real-time connection latency measurement.

---

## 💡 Key JavaScript Concepts Demonstrated
* **Asynchronous Programming & Promises:**
  * Executing non-blocking HTTP requests with `.then()` fulfillment and `.catch()` error handling.
* **Native Fetch API:**
  * Modern standard `fetch(url)` returning a promise that resolves to a Response object, parsed with `response.json()`.
* **jQuery `$.getJSON()`:**
  * Concise shorthand helper method for executing HTTP GET requests expecting JSON responses.
* **Performance Telemetry (`performance.now()`):**
  * Measuring high-resolution timestamps before and after network execution to calculate exact roundtrip latency in milliseconds.
* **Search & Filter Operations:**
  * Real-time client-side array filtering across fetched developer cards.

---

## 🚀 Key Features
* Vercel-inspired minimalist dark charcoal developer portfolio layout.
* Method switch: toggle between native **Fetch API** and **jQuery `$.getJSON()`** to compare execution syntax and latency.
* Dynamic developer user cards rendered with company, website, and email badges.
* Live code execution syntax display box showing the exact asynchronous code running under the hood.

---

## 📁 Folder Structure
```text
Practical_10/
├── index.html       # Portfolio hero and API showcase layout
├── script.js        # Fetch API, jQuery AJAX, and latency timing logic
├── style.css        # Vercel-inspired dark theme styles
└── README.md        # Practical documentation
```

---

## 🛠️ How to Run
1. Open `Practical_10` in **VS Code**.
2. Run `index.html` via **Live Server**.
