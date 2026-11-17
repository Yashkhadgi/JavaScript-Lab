# 📱 Task 3: Phone Number & College Email OTP Verification Engine

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement client-side telephone number validation (`/^[6-9]\d{9}$/`), college domain email checking, simulated OTP generation, countdown timer with `setInterval()`, and jQuery DOM event handling.

---

## 💡 Key JavaScript & jQuery Concepts Demonstrated
* **Regular Expression Validation:**
  * Indian mobile number format validation: 10 digits starting with 6, 7, 8, or 9.
  * College email validation targeting academic domain patterns (`.edu` / `.ac.in`).
* **jQuery DOM Transitions:**
  * Dynamically hiding the initial input form and revealing the OTP verification card (`slideDown()`, `.show()`).
* **OTP Countdown Timer:**
  * Using `setInterval()` to tick down a 30-second expiration window.
  * Clearing the timer via `clearInterval()` upon successful verification or timeout.
* **EmailJS Integration:**
  * Asynchronous dispatch of one-time passwords directly to client inboxes using the EmailJS browser SDK.

---

## 🚀 Key Features
* Dual verification: 10-digit phone number + academic email.
* Real-time 30-second expiring OTP countdown timer.
* Interactive feedback: success modals and invalid input alerts.

---

## 📁 Folder Structure
```text
Task_3/
├── index.html       # Dual verification and OTP card layout
├── script.js        # Phone/Email regex validation, OTP timer, and EmailJS logic
├── style.css        # Clean verification box styling
└── README.md        # Task documentation
```

---

## 🛠️ How to Run
1. Open `Task_3` in **VS Code**.
2. Run `index.html` via **Live Server**.
