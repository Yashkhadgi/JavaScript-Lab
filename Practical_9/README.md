# ⚙️ Practical 9: System Preferences Console — Web Storage API Sync

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement the Web Storage API (`localStorage` and `sessionStorage`) to store, retrieve, synchronize, and clear user preference settings across persistent browser lifetimes and ephemeral session tabs.

---

## 💡 Key JavaScript Concepts Demonstrated
* **`localStorage` (Persistent Storage Engine):**
  * Data survives browser closes and OS restarts with no expiry date.
  * Used for global system themes (Dark / Light mode) and accent color preferences.
* **`sessionStorage` (Ephemeral Session Storage Engine):**
  * Scoped exclusively to the active browser tab session.
  * Used for temporary font-scale multipliers, active view state, and tab audit counters.
* **Storage API Methods:**
  * `setItem(key, value)`: Writing key-value pairs.
  * `getItem(key)`: Reading stored values.
  * `removeItem(key)`: Deleting specific configuration keys.
  * `clear()`: Purging entire storage domains.
* **JSON Serialization (`JSON.stringify()` / `JSON.parse()`):**
  * Converting complex objects to strings for storage and deserializing them on retrieval.

---

## 🚀 Key Features
* Native Apple macOS / iPadOS Settings interface with soft neumorphism and glassmorphism.
* Real-time theme toggling that transforms the entire UI background and shadows.
* Live JSON inspectors displaying the raw internal state of both storage engines.
* Reset to Defaults button that wipes stored keys and restores default configuration.

---

## 📁 Folder Structure
```text
Practical_9/
├── assets/          # macOS system category icons
├── index.html       # Split-pane preferences layout
├── script.js        # localStorage / sessionStorage synchronization engine
├── style.css        # Apple macOS neumorphic UI styling
└── README.md        # Practical documentation
```

---

## 🛠️ How to Run
1. Open `Practical_9` in **VS Code**.
2. Run `index.html` via **Live Server**.
