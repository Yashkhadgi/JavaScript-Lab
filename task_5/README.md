# 🛡️ Task 5: Client-Side Authentication & Strict Session Management Engine

> **Student Name:** Yash Khadgi  
> **PRN:** 24070521137  
> **Course:** JavaScript Web Development Laboratory  

---

## 📌 Aim & Objective
Implement a secure client-side authentication flow and strict session management architecture using `localStorage` (user database), `sessionStorage` (active session tokens), and `window.location.replace()` for route protection without browser back-button leaks.

---

## 💡 Key Concepts Demonstrated
* **Dual Storage Strategy:**
  * `localStorage`: Acts as persistent client database storing registered user credentials.
  * `sessionStorage`: Holds ephemeral `active_session` tokens that persist only while the browser tab remains active.
* **Client-Side Route Guards:**
  * **Protected Route (`dashboard.html`):** Executes an immediate route-guard check on load. Unauthenticated users are redirected back to `index.html`.
  * **Public Route (`index.html`):** If an active session already exists, logged-in users are automatically routed forward to the dashboard.
* **History Stack Control (`window.location.replace`):**
  * Replaces the current URL in browser history, preventing unauthorized users from clicking the browser "Back" button to access the dashboard after logout.
* **Cache Invalidation:**
  * Meta headers preventing the browser from caching authenticated dashboard views.

---

## 🚀 Key Features
* Full Login and Registration workflow.
* Protected user profile dashboard displaying active user email and session timestamp.
* Instant Logout action that purges `sessionStorage` and sanitizes the browser history stack.

---

## 📁 Folder Structure
```text
task_5/
├── index.html                   # Public login and registration portal
├── dashboard.html               # Protected user dashboard view
├── app.js                       # Session management, route guard, and auth logic
├── style.css                    # Authentication UI styling
├── Session_Management_Logic.md  # Detailed architecture and flow diagrams
└── README.md                    # Task documentation
```

---

## 🛠️ How to Run
1. Open `task_5` in **VS Code**.
2. Run `index.html` via **Live Server**.
