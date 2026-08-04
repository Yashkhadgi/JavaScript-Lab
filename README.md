# JavaScript Lab: Hand-Crafted Web Applications & Interactive Modules

> A production-ready collection of 10 standalone JavaScript practical modules and specialized web application tasks built with modern UI design systems, ES6+ architecture, DOM manipulation, Web Storage, and asynchronous API pipelines.

---

## 2. Project Overview

The **JavaScript Lab** repository is an academic and practical engineering showcase designed to demonstrate core and advanced JavaScript (ES6+) concepts, DOM tree manipulation, client-side state persistence, event handling, and asynchronous network data fetching. 

Instead of generic, cookie-cutter college assignments, every practical experiment in this repository is built as a polished, standalone web application inspired by world-class UI design systems (such as Linear.app, Vercel, Raycast, Apple, Supabase, Shopify, Nike, and native macOS). Every module fits on a single viewport screen without page-level scrolling, utilizing internal scrollable views for optimal user experience.

This repository serves computer science students, academic evaluators, and frontend engineering recruiters seeking modular, production-ready vanilla JavaScript implementations without heavy external framework overhead.

---

## 3. Key Features

* **Academic Marks & Grade Portal (Practical 3)**: Vercel/Linear-style analytics dashboard featuring subject additions, mark aggregations, percentage calculations, letter grade classifications, and rank metrics.
* **Palindrome String & Word Analyzer (Practical 4)**: Raycast-style developer utility providing forward/reversed string symmetry detection, single-word and multi-word phrase analysis, and character alignment matrix grids.
* **Scandinavian E-Commerce Storefront (Practical 5)**: Luxury fashion storefront featuring custom product creation, higher-order array transformations (`map`, `filter`, `reduce`, `push`), 18% GST tax computations, and live receipt drawers.
* **Light Studio Regex Data Mining Console (Practical 6)**: Supabase-inspired data extractor offering email format validation, custom Regex pattern testing, pastel entity chips (emails, phone numbers, dates), and word-length distribution charts.
* **Apple-Style Interactive Assessment Portal (Practical 7)**: 2-row task engine featuring task creation, priority selection, percentage completion progress bars, tab filters, and real-time DOM tree traversal logging (`parentElement`, `children`, `closest()`).
* **Iron Forge Athletic Member Portal (Practical 8)**: Industrial athletic portal with real-time form validation (name, age, phone, email), membership tier selection cards, and a digital member access badge with barcode graphics.
* **macOS System Preferences Console (Practical 9)**: Native macOS system settings UI demonstrating `localStorage` (permanent theme persistence) vs `sessionStorage` (tab session font scaling) synchronization, anti-flash scripts, and live JSON memory inspectors.
* **Developer Portfolio & API Telemetry Engine (Practical 10)**: Minimalist Vercel developer portfolio featuring asynchronous data fetching via native Fetch API and jQuery `$.getJSON()`, latency timers (`performance.now()`), and syntax execution drawers.
* **Secure Email Authentication Portal (Task 1)**: Scandinavian minimal auth panel featuring real-time input status indicators, password strength bar meters, toast notifications, and secure session state switching.
* **Cascading Weather Information Engine (Task 2)**: Vercel/Linear-style weather console with cascading State $\rightarrow$ City dropdown selectors, °C/°F temperature unit toggles, 5-day climate forecast cards, and 6-tile telemetry metrics.

---

## 4. Demo and Screenshots

> Add project screenshots here.

* **Live Workspace Repository**: [https://github.com/Yashkhadgi/JavaScript-Lab](https://github.com/Yashkhadgi/JavaScript-Lab)
* **Author Attribution**: `Designed by Yash Khadgi | PRN: 24070521137`

---

## 5. How It Works

1. **User Interaction**: The user interacts with form inputs, dropdown selectors, range controls, or action buttons across any practical module.
2. **Event Handling**: JavaScript event listeners (`input`, `change`, `click`, `submit`, `keypress`) intercept user actions asynchronously.
3. **Data Processing & Validation**: Inputs are sanitized and validated using Regular Expressions, array pipelines (`map`, `filter`, `reduce`), or condition logic.
4. **DOM & State Mutation**: The JavaScript engine mutates the live Document Object Model (DOM) tree, updating text nodes, progress bars, or rendering dynamic component lists.
5. **Storage & Network Sync**: States are persisted to browser memory (`localStorage`/`sessionStorage`) or fetched from external REST endpoints (`fetch()`, `$.getJSON()`).

---

## 6. Architecture

```text
User Interface (HTML5 / Vanilla CSS)
  ↓
Event Listeners & Input Sanitization (JavaScript ES6+)
  ↓
Core Logic Modules
  ├── Data Validation & Regex Parsing (Practicals 4, 6, 8, Task 1)
  ├── Array Pipelines & Financial Math (Practicals 3, 5)
  ├── DOM Traversal & Tree Mutations (Practical 7)
  ├── Web Storage Persistence Engine (Practical 9)
  └── Asynchronous Network Telemetry (Practical 10, Task 2)
  ↓
Dynamic UI Rendering & DOM Updates
```

---

## 7. Tech Stack

| Category | Technologies |
| --- | --- |
| **Languages** | HTML5, CSS3 (Vanilla CSS, Flexbox, CSS Grid), JavaScript (ES6+) |
| **Libraries & APIs** | jQuery 3.7.1, Native Fetch API, Web Storage API (`localStorage`, `sessionStorage`), High-Resolution Time API (`performance.now()`) |
| **Design Systems & Fonts** | Google Fonts (Inter, Playfair Display, Montserrat, JetBrains Mono), Font Awesome 6.5.1 Icons |
| **Media & Assets** | Unsplash High-Resolution Photography, Local Generated Background Assets |
| **Development Tools** | Visual Studio Code, Live Server, Google Chrome Browser, Git / GitHub |

---

## 8. Project Structure

```text
JavaScript-Lab/
├── Practical_1/               # String Length & Character Counter
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Practical_2/               # Billing Calculator (var, let, const, destructuring)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Practical_3/               # Academic Marks & Grade Evaluation Portal
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Practical_4/               # Palindrome String & Word Analyzer
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── Practical_5/               # La Boutique De Paris (E-Commerce Storefront)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── Practical_6/               # Supabase Light Regex & Data Mining Engine
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── Practical_7/               # Apple-Style Interactive Assessment Portal
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── Practical_8/               # Iron Forge Athletic Club (Gym Registration Portal)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── Practical_9/               # Native macOS System Preferences Console
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── Practical_10/              # Minimalist Developer Portfolio & API Engine
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Task_1/                    # Secure Email Authentication Portal
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── Task_2/                    # Cascading Weather Information Engine
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
├── .gitignore
└── README.md
```

### Purpose of Major Folders
* **`Practical_3` to `Practical_10`**: Core laboratory experiment modules covering academic grade evaluations, string algorithms, e-commerce cart pipelines, regex extraction, DOM tree traversal, form validation, Web Storage API, and asynchronous APIs.
* **`Task_1` & `Task_2`**: Standalone web application tasks featuring email authentication workflows and cascading multi-region weather telemetry.

---

## 9. Getting Started

### Prerequisites

To run any practical module locally, you only need a modern web browser:
* Google Chrome, Mozilla Firefox, Safari, or Microsoft Edge.
* Visual Studio Code with the **Live Server** extension (recommended for local development).

### Clone the Repository

```bash
git clone https://github.com/Yashkhadgi/JavaScript-Lab.git
cd JavaScript-Lab
```

### Running Locally

Since all practicals are built using standard web technologies (HTML/CSS/JS), no build steps or `npm install` commands are required:

1. Open the project folder in Visual Studio Code.
2. Navigate to any practical directory (e.g., `Practical_5` or `Task_2`).
3. Right-click on `index.html` and select **"Open with Live Server"** (or double-click `index.html` to open directly in your web browser).

---

## 10. Usage

### Practical 5 (Shopping Cart Engine)
1. Enter custom product details (Name, Price in ₹, Category) in the top bar and click **"Add Creation"** to prepend custom items to the catalog.
2. Click **"Add to Bag"** on any item to add it to the cart.
3. Observe live subtotal accumulation, 18% GST calculation, and grand total updating in the right receipt panel.

### Practical 6 (Regex Data Extractor)
1. Type a target email address in the single email verifier to see real-time `VALID` / `INVALID` status badges.
2. Enter custom Regex patterns (e.g., `\b[A-Z][a-z]+\b` or `\d+`) into the pattern tester field to highlight custom matches in the text payload.
3. Observe extracted entity chips (emails, phone numbers, dates) and word-length bar charts.

### Task 2 (Cascading Weather Engine)
1. Select a Region/State from the **Select State** dropdown (e.g., *Maharashtra*, *Delhi NCR*, *California*).
2. Observe the **Select City** dropdown automatically populate and enable.
3. Select a target City to view temperature, weather condition icons, 5-day forecast cards, and 6-tile climate metrics.

---

## 11. External API Integration

Practical 10 consumes a public REST API endpoint to demonstrate asynchronous data fetching:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `https://jsonplaceholder.typicode.com/users` | Retrieves remote developer user profiles and organization metadata |

---

## 12. Results and Performance

* **Network Latency Measurement**: Practical 10 integrates `performance.now()` to measure exact network roundtrip latency in milliseconds for Fetch API and jQuery `$.getJSON()` calls.
* **Zero Layout Shift**: Viewports are constrained to `100vh` with `overflow: hidden` on root bodies and internal overflow scrolling on lists, eliminating page-level layout shifts.
* **Instant Storage Sync**: Practical 9 reads and writes to `localStorage` and `sessionStorage` in under 1ms with zero flicker via head anti-flash inline scripts.

---

## 13. Testing

Manual verification and browser console testing were conducted across all modules:
* **DOM Node Assertion**: Verified node relationships (`parentElement`, `children`, `closest()`) in Practical 7.
* **Regex Boundary Testing**: Verified email format validation against valid (`name@domain.com`) and invalid (`name@domain`, `@domain.com`) test vectors.
* **Browser Storage Inspection**: Verified key-value persistence in Chrome DevTools $\rightarrow$ Application $\rightarrow$ Local Storage / Session Storage.

---

## 14. Security and Privacy

* **Input Sanitization**: User inputs rendered in DOM trees use `.textContent` instead of `.innerHTML` where applicable to prevent Cross-Site Scripting (XSS) injection.
* **Client-Side Storage Isolation**: `localStorage` and `sessionStorage` keys are scoped strictly to origin domains.
* **No Secret Exposure**: All code runs client-side without embedded API keys or plain-text secrets.

---

## 15. Limitations

* **Simulated Weather Data**: Task 2 utilizes a structured client-side climate dataset for multi-region cities rather than a live paid OpenWeatherMap API key.
* **Static Product Storage**: Custom items added in Practical 5 reset upon hard browser reload unless connected to a database backend.

---

## 16. Future Improvements

* Add Node.js / Express backend server integration with MongoDB persistence.
* Integrate live OpenWeatherMap API endpoints for global city weather lookups.
* Implement Dark/Light mode theme toggles across all practical modules.

---

## 17. Lessons and Technical Highlights

* **Declarative Array Processing**: Applied higher-order ES6 array transformations (`map`, `filter`, `reduce`) to eliminate manual `for` loops in e-commerce pipelines.
* **DOM Traversal API Mastery**: Utilized relative node navigation (`parentElement`, `children`, `closest()`) for dynamic element removal and event delegation.
* **Web Storage Lifecycle Sync**: Leveraged `localStorage` for non-expiring settings and `sessionStorage` for tab-bound UI font scaling.
* **Asynchronous Telemetry Timing**: Compared native Fetch API promises against jQuery `$.getJSON()` using `performance.now()` timestamps.

---

## 18. Author

**Yash Khadgi**  
PRN: `24070521137`  
GitHub: [https://github.com/Yashkhadgi](https://github.com/Yashkhadgi)

---

## 19. License

This project currently does not include an open-source license.
