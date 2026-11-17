# ⏱️ Practical 11: ChronoSync — Dynamic Class Scheduler & Countdown Engine

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Use JavaScript timers (`setTimeout()`, `setInterval()`) and ES6 modules (`import`/`export`) to build a dynamic countdown or class scheduler with real-time updates and responsive layout.

---

## 💡 Key JavaScript Concepts Demonstrated
* **`setInterval()` & `clearInterval()`:**
  * Master 1000ms digital clock heartbeat tracking wall-clock drift.
  * Real-time class session progress calculation and remaining time countdown.
  * Focus study sprint (Pomodoro) interval timer with pause/resume/reset lifecycle controls.
* **`setTimeout()` & `clearTimeout()`:**
  * Auto-dismissing floating toast alerts.
  * Scheduled reminder chimes prior to period transitions.
* **ES6 Modular Architecture (`import` / `export`):**
  * Strict separation of concerns across 5 modular sub-systems:
    * `storage.js`: Local persistence (`localStorage`) and default timetable schema.
    * `schedule.js`: Time conversion math (24h to minutes from midnight) and session status resolution.
    * `timer.js`: Classes for `MasterClock` and `SprintCountdown` with timer telemetry.
    * `audio.js`: Synthesized college bells and completion fanfares via the Web Audio API.
    * `ui.js`: Dynamic DOM card generation, progress bar updates, and modal handlers.
    * `main.js`: Main application entry point orchestrating reactive state.

---

## 🚀 Key Features
* Cyber-academic dark studio aesthetic with frosted glass cards and glowing status pills.
* Live session hero card with real-time countdown digits and session progress percentage.
* Interactive study sprint widget with configurable presets (15m, 25m, 45m, 60m).
* Evaluator Time-Warp Tool: warp clock to any day or time and speed up interval ticks ($1\times, 5\times, 10\times, 60\times$).
* Full CRUD: Add, edit, and delete academic lectures with validation.
* Live Telemetry Console: inspect active `setInterval` and `setTimeout` handles and event loop drift in milliseconds.

---

## 📁 Folder Structure
```text
Practical_11/
├── js/
│   ├── modules/
│   │   ├── audio.js         # Web Audio API sound synthesis
│   │   ├── schedule.js      # Timetable math and status resolution
│   │   ├── storage.js       # localStorage persistence & syllabus data
│   │   ├── timer.js         # setInterval/setTimeout engine & drift tracking
│   │   └── ui.js            # Dynamic DOM rendering and card templates
│   └── main.js              # Application entry point
├── index.html               # Main dashboard layout
├── style.css                # Glassmorphic dark studio stylesheet
└── README.md                # Practical documentation
```

---

## 🛠️ How to Run
1. Open `Practical_11` in **VS Code**.
2. Right-click `index.html` and choose **"Open with Live Server"** (required for native browser ES6 module loading).
