# 🌦️ Task 2: Cascading State-City Weather Telemetry Engine

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement cascading dropdown event handlers, dynamic nested object indexing, temperature unit conversion formulas (°C $\leftrightarrow$ °F), and multi-day climate forecasting cards using JavaScript.

---

## 💡 Key JavaScript Concepts Demonstrated
* **Cascading Dropdown Architecture:**
  * Listening to `change` events on the primary "State" selector.
  * Dynamically populating the secondary "City" selector based on the selected state's keys.
* **Mathematical Unit Conversion:**
  * Celsius to Fahrenheit: $F = (C \times 9/5) + 32$.
  * Fahrenheit to Celsius: $C = (F - 32) \times 5/9$.
* **DOM Traversal & Card Generation:**
  * Rendering atmospheric metrics: humidity, wind velocity, air quality index (AQI), and UV index.
  * Dynamic 5-day weather forecast card generation using array mapping.

---

## 🚀 Key Features
* Vercel-style weather console with blurred climate backdrop.
* Interactive unit switcher (°C / °F) with instant updates across all metric cards.
* Live digital clock ticking in the header.
* Responsive multi-day forecast strip.

---

## 📁 Folder Structure
```text
Task_2/
├── assets/          # Weather weather icons and backgrounds
├── index.html       # Cascading selector and forecast dashboard
├── script.js        # Cascading dataset, unit conversions, and weather engine
├── style.css        # Clean dark weather console styles
└── README.md        # Task documentation
```

---

## 🛠️ How to Run
1. Open `Task_2` in **VS Code**.
2. Run `index.html` via **Live Server**.
