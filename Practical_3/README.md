# 🎓 Practical 3: Academic Marks & Grade Evaluation Portal

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Use conditional statements (`if...else`, `switch`), loops (`forEach`, `reduce`), and modular function definitions to calculate total marks, overall average percentage, individual passing status, and assign academic letter grades.

---

## 💡 Key JavaScript Concepts Demonstrated
* **Conditional Branching (`if...else`, `switch`):**
  * Grade categorization: `A+` ($\ge 90\%$), `A` ($75-89\%$), `B` ($60-74\%$), `C` ($45-59\%$), `D` ($35-44\%$), and `Fail` ($< 35\%$).
  * Individual subject passing verification (marks $\ge 35$).
* **Array Iterators & Accumulation:**
  * `reduce()`: Summing numerical mark inputs to compute grand total.
  * `forEach()`: Iterating across subject entries to construct grade pills and inspect overall eligibility.
* **Modular Single-Responsibility Functions:**
  * Clean separation of input parsing, percentage math, grade allocation, and DOM injection.

---

## 🚀 Key Features
* Glassmorphic SaaS dashboard interface with dynamic visual indicators.
* Add/remove custom subject fields dynamically.
* Real-time percentage meter, letter grade pill, rank determination, and pass/fail summary.

---

## 📁 Folder Structure
```text
Practical_3/
├── assets/          # Supportive icons and graphic assets
├── index.html       # Evaluation portal UI layout
├── script.js        # Grade calculations, conditionals, and loops
├── style.css        # Glassmorphic SaaS dashboard styles
└── README.md        # Practical documentation
```

---

## 🛠️ How to Run
1. Open `Practical_3` in **VS Code**.
2. Launch `index.html` via **Live Server**.
