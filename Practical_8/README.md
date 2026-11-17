# 🏋️ Practical 8: Iron Forge Club — Form Validation & Digital Access Badge Generator

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement client-side form validation mechanisms (`e.preventDefault()`, real-time regex matching, custom error messages) and dynamic DOM compilation to generate a live, interactive 3D VIP Gym Member Access Card.

---

## 💡 Key JavaScript Concepts Demonstrated
* **Form Submission Interception (`e.preventDefault()`):**
  * Halting native browser form submission to execute client-side validation rules without reloading the page.
* **Regular Expression Field Sanitization:**
  * Full name validation (letters and spaces only).
  * Email format verification via RFC-compliant regex.
  * 10-digit phone number validation (`/^[6-9]\d{9}$/`).
  * Date-of-birth age threshold evaluation ($\ge 16$ years).
* **Live DOM Synchronization & 3D Tilt:**
  * Mirroring form input directly onto an interactive digital access badge in real time.
  * Card flip / perspective tilt based on cursor coordinates.

---

## 🚀 Key Features
* Industrial dark athletic theme with high-contrast Volt yellow accents.
* Live digital access pass with simulated QR code and holographic membership status pill.
* Instant visual feedback: green borders for valid fields, red error tooltips for invalid inputs.
* Print / Save Digital Pass functionality.

---

## 📁 Folder Structure
```text
Practical_8/
├── assets/          # Gym branding assets and textures
├── index.html       # Split-screen form and live pass view
├── script.js        # Regex validation logic and 3D card sync
├── style.css        # High-contrast athletic dark UI
└── README.md        # Practical documentation
```

---

## 🛠️ How to Run
1. Open `Practical_8` in **VS Code**.
2. Run `index.html` via **Live Server**.
