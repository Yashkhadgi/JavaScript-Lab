# 🧩 Practical 7: Apple Assessment Portal — DOM Traversal & Dynamic Task Board

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement DOM Tree Traversal methods (`parentElement`, `children`, `closest()`, `querySelector()`) and dynamic node manipulation to build an interactive Apple-style assessment portal with real-time question navigation and score computation.

---

## 💡 Key JavaScript Concepts Demonstrated
* **DOM Tree Navigation & Traversal:**
  * `closest('.card')`: Finding the nearest ancestor element matching a selector.
  * `parentElement`: Navigating up the DOM hierarchy from child input targets.
  * `children` & `childNodes`: Accessing option collections within card containers.
* **Dynamic Node Mutation:**
  * Creating elements with `document.createElement()`.
  * Class toggling (`classList.add()`, `classList.toggle()`, `classList.remove()`).
  * Appending and removing DOM nodes dynamically.
* **Assessment Engine Logic:**
  * Tracking user selection state, evaluating correct answers, and computing percentage scores.

---

## 🚀 Key Features
* Apple-inspired bento grid UI with smooth spring transitions.
* Interactive radio option cards with custom visual selection checkmarks.
* Real-time progress bar and XP points counter.
* Dynamic scorecard modal upon submission.

---

## 📁 Folder Structure
```text
Practical_7/
├── assets/          # Apple-style icons and badges
├── index.html       # Assessment portal layout
├── script.js        # DOM traversal logic and quiz scoring engine
├── style.css        # Minimalist Apple bento grid styling
└── README.md        # Practical documentation
```

---

## 🛠️ How to Run
1. Open `Practical_7` in **VS Code**.
2. Launch `index.html` via **Live Server**.
