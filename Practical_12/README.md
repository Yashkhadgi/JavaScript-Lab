# 📡 Practical 12: PulseOps — Cloud Operations & API Telemetry Command Hub

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Build an interactive real-time web application using JavaScript and jQuery 3.7.1 demonstrating DOM manipulation, event handling, dual Web Storage management (`localStorage`, `sessionStorage`), and asynchronous AJAX integration.

---

## 💡 Key Concepts Demonstrated Across the 4 Pillars
* **1. DOM Manipulation (jQuery):**
  * Programmatic card element creation via `$('<article class="incident-card">')`.
  * Animated state transitions using `.slideUp()`, `.fadeIn()`, `.fadeOut()`, and `.slideToggle()`.
  * Dynamic metric counters for total requests, average latency, and storage objects.
* **2. Event Handling & Delegation:**
  * Delegated click events (`$(document).on('click', '.btn-star-incident', ...)`) for dynamically inserted cards.
  * Real-time search filtering on `input` / `keyup` events.
  * Global keyboard shortcuts: `⌘K` or `Ctrl+K` for search focus, `Shift + N` for new ticket modal, `Escape` to close modals.
  * Decoupled custom jQuery event triggers (`pulse:dataUpdated`, `pulse:sessionLogAdded`).
* **3. Web Storage API (`localStorage` & `sessionStorage`):**
  * `localStorage`: Long-term persistence for the incident cache and starred watchlist items.
  * `sessionStorage`: Ephemeral in-memory tab session logs and request metrics that clear when the browser tab closes.
  * Live Storage Inspector modal rendering formatted JSON dumps of both storage engines.
* **4. AJAX Integration (`$.ajax()`):**
  * Asynchronous `GET` requests fetching live remote REST records with promise handlers (`.done()`, `.fail()`).
  * Asynchronous `POST` dispatch simulating incident creation with `201 Created` status handling.
  * Millisecond roundtrip latency measurement via `performance.now()`.
  * Background interval auto-polling engine (every 8 seconds).

---

## 🚀 Key Features
* Cyberpunk Raycast-style Operations Command HUD.
* Real-time telemetry bar (Total AJAX Calls, Latency in ms, Last HTTP Code, Storage Count).
* Priority categorization (Critical, High, Medium, Low) and status workflows (Investigating, Identified, Monitoring, Resolved).
* Storage Inspector modal with one-click purge action.
* Collapsible session audit log drawer.

---

## 📁 Folder Structure
```text
Practical_12/
├── app.js           # jQuery application engine, DOM handlers, Storage & AJAX
├── index.html       # Command center HUD layout and modals
├── style.css        # Cyberpunk operations theme styles
└── README.md        # Practical documentation
```

---

## 🛠️ How to Run
1. Open `Practical_12` in **VS Code**.
2. Run `index.html` via **Live Server** (or open in Google Chrome).
