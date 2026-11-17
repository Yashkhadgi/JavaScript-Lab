# 🔍 Practical 4: Palindrome Phrase & Word Symmetry Analyzer

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement string manipulation methods, regular expression sanitization, and array reversal algorithms to build an interactive Palindrome String Analyzer tool with character alignment breakdown.

---

## 💡 Key JavaScript Concepts Demonstrated
* **String Sanitization via Regular Expressions:**
  * Stripping spaces, symbols, and punctuation using `.replace(/[^a-z0-9]/g, '')`.
  * Normalizing letter casing with `.toLowerCase()`.
* **String Reversal via Array Methods:**
  * Converting strings to arrays: `.split('')`.
  * Reversing array elements: `.reverse()`.
  * Rebuilding reversed strings: `.join('')`.
* **Symmetry Verification & Matrix Mapping:**
  * Strict equality checking (`cleaned === reversed`).
  * Index-by-index character comparison to visually identify alignment and mismatch locations.

---

## 🚀 Key Features
* Retro-futuristic cyberpunk terminal HUD theme.
* Real-time string analysis as the user types.
* Visual character alignment grid highlighting matching vs mismatching letters.
* Match percentage calculation for near-palindrome phrases.

---

## 📁 Folder Structure
```text
Practical_4/
├── assets/          # Terminal HUD icons and background assets
├── index.html       # Analyzer interface layout
├── script.js        # String reversal algorithms and character matrix logic
├── style.css        # Cyberpunk neon terminal styles
└── README.md        # Practical documentation
```

---

## 🛠️ How to Run
1. Open `Practical_4` in **VS Code**.
2. Right-click `index.html` and launch with **Live Server**.
