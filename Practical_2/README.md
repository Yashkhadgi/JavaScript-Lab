# 🧾 Practical 2: Smart Billing Calculator — ES6 Scoping & Destructuring

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement variable scoping declarations (`var`, `let`, `const`), ES6 Template Literals, and Object & Array Destructuring to construct a real-time smart billing calculator engine with dynamic receipt compilation.

---

## 💡 Key JavaScript Concepts Demonstrated
* **Variable Scoping (`var`, `let`, `const`):**
  * `const`: Assigned to non-reassignable configuration values (tax rates, discount bounds).
  * `let`: Used for mutable computation states (subtotal, applied discounts, cumulative grand total).
  * `var`: Studied to understand function-scoped variable hoisting vs block-scoping.
* **ES6 Destructuring:**
  * Extracting item properties (`const { name, price, qty } = item`) cleanly without repeated dot notations.
* **Template Literals (Backtick Strings):**
  * Dynamically constructing multi-line formatted billing receipts with embedded expressions (`${item.price * item.qty}`).

---

## 🚀 Key Features
* Dynamic item line addition with custom quantities, pricing, and GST calculation.
* Discount percentage application with real-time subtotal updates.
* Instant digital receipt generation rendered with clean monospace typography.

---

## 📁 Folder Structure
```text
Practical_2/
├── index.html       # Billing calculator interface and receipt display
├── script.js        # Destructuring logic, scoping, and calculation engine
├── style.css        # Dark minimalist utility theme styles
└── README.md        # Practical documentation
```

---

## 🛠️ How to Run
1. Open `Practical_2` folder in **VS Code**.
2. Right-click `index.html` and select **"Open with Live Server"**.
