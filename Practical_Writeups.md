# JavaScript Lab Practical Writeups (Experiments 3 to 10)

---

## Experiment Number: 3

**Aim:**  
Use conditional statements (`if...else`, `switch`), loops, and function definitions to calculate total marks, percentage, and assign grades for an Academic Marks Evaluation Portal.

**Software/Tools Required:**  
Visual Studio Code, Live Server Extension, Google Chrome Browser, HTML5, CSS3, JavaScript (ES6)

**Theory:**  
Control flow and modular functions are fundamental building blocks in JavaScript programming for making decisions and executing repetitive operations based on data inputs.

* **Conditional Statements (`if...else`, `else if`):**  
  Conditionals allow code execution paths to branch based on Boolean evaluation (`true` or `false`). In grade calculations, conditional chains inspect percentage bounds to assign appropriate letter grades (e.g., `A+` for $\ge 90\%$, `A` for $75-89\%$, `B` for $60-74\%$, etc.) and check individual subject passing criteria ($\ge 35$).

* **Loops (`forEach`, `reduce`, `for`):**  
  Loops iterate over collections of data such as arrays of subject objects. The `reduce()` method accumulates numerical scores to calculate total marks obtained, while `forEach()` iterates over subjects to render individual course cards and evaluate pass/fail criteria across all enrolled courses.

* **Functions & Modular Logic:**  
  Functions encapsulate reusable logic that accepts parameters and returns computed values. Modular functions separate data extraction, percentage computation, grade assignment, and DOM rendering into clean, single-responsibility functions.

**Output:**  
*(Insert your screenshot here)*

**Result:**  
An Academic Marks Evaluation Portal was successfully designed and developed. The application accepts subject names and numerical marks, computes the aggregate marks and overall average percentage using loops and arithmetic functions, evaluates pass/fail status using conditional statements, and displays a grade rank breakdown. The outputs were verified for accuracy across edge cases.

**Conclusion:**  
Through this practical, the application of conditional logic, looping constructs, and modular function definitions in JavaScript was thoroughly understood. It was observed how conditional branching allows dynamic grade classification and how array iteration methods simplify mathematical aggregation over structured data collections.

---

## Experiment Number: 4

**Aim:**  
Implement string manipulation methods, regular expressions, and array reversal logic to build a Palindrome String Analyzer tool.

**Software/Tools Required:**  
Visual Studio Code, Live Server Extension, Google Chrome Browser, HTML5, CSS3, JavaScript (ES6)

**Theory:**  
String processing and pattern matching are essential tasks in web application development when sanitizing user input and verifying textual symmetry.

* **String Sanitation & Regular Expressions:**  
  Raw user strings often contain spaces, punctuation, and mixed casing. Using JavaScript string methods such as `toLowerCase()` and regular expression replacement `replace(/[^a-z0-9]/g, '')`, all non-alphanumeric characters are stripped away to produce a sanitized, normalized string.

* **String Reversal & Array Transformation:**  
  Strings in JavaScript are immutable. To reverse a string, it is split into an array of individual characters using `split('')`, reversed using the array method `reverse()`, and joined back into a string using `join('')`.

* **Symmetry Verification:**  
  A string is defined as a palindrome if the original sanitized string is strictly identical to its reversed counterpart (`cleaned === reversed`). Position-by-position character matching is performed to identify character alignment and highlight exact mismatch locations.

**Output:**  
*(Insert your screenshot here)*

**Result:**  
A Palindrome String Analyzer tool was successfully constructed. The application sanitizes user-entered phrases, computes forward and reversed character arrays, inspects exact character symmetry, displays character position alignment boxes, and calculates match percentages. The logic was verified with various palindrome and non-palindrome test cases.

**Conclusion:**  
Through this practical, key string manipulation techniques, regular expression patterns, and array conversion utilities in JavaScript were learned. The practical demonstrated how string normalization and array reversal algorithms enable efficient textual comparison and data transformation.

---

## Experiment Number: 5

**Aim:**  
Implement higher-order array methods (`map`, `filter`, `reduce`, `push`) to process shopping cart operations, calculate subtotal, GST tax, and total price in an E-Commerce Storefront.

**Software/Tools Required:**  
Visual Studio Code, Live Server Extension, Google Chrome Browser, HTML5, CSS3, JavaScript (ES6)

**Theory:**  
Functional programming principles in modern JavaScript provide powerful higher-order methods to process arrays cleanly without manual loop indexing.

* **Array Insertion (`push`):**  
  The `push()` method appends new item objects containing product details (`id`, `name`, `price`, `qty`) to the cart array.

* **Array Filtering (`filter`):**  
  The `filter()` method creates a new array containing only elements that pass a test condition. It is used to remove an item from the shopping cart when a user clicks the delete action by filtering out the target product ID.

* **Array Mapping (`map`):**  
  The `map()` method transforms every element in an array and returns a new array of equal length. It is used to transform an array of cart item objects into an array of line-item subtotal prices (`item.price * item.qty`).

* **Array Reduction (`reduce`):**  
  The `reduce()` method executes a reducer function on each array element, resulting in a single output value. It is utilized to accumulate total item quantities and calculate the grand subtotal of all selected goods.

**Output:**  
*(Insert your screenshot here)*

**Result:**  
An E-Commerce Storefront and Checkout Engine was successfully built. The application allows users to add items to a shopping cart, adjust quantities, delete items using `filter()`, compute line-item totals using `map()`, and accumulate the subtotal and 18% GST tax using `reduce()`. The cart calculations were verified to be accurate.

**Conclusion:**  
Through this practical, the utility of ES6 higher-order array methods (`map`, `filter`, `reduce`, `push`) was understood. It was observed that declarative array methods result in cleaner, immutable, and less error-prone code compared to traditional `for` loops when handling dynamic shopping cart states.

---

## Experiment Number: 6

**Aim:**  
Use Regular Expressions (Regex) for email format validation, text pattern extraction (emails, phone numbers, dates), and string tokenization to build a Text Analytics Console.

**Software/Tools Required:**  
Visual Studio Code, Live Server Extension, Google Chrome Browser, HTML5, CSS3, JavaScript (ES6)

**Theory:**  
Regular Expressions (Regex) provide pattern-matching logic to search, validate, and extract specific character combinations within text strings.

* **Regex Pattern Syntax & Character Classes:**  
  Regex patterns use character classes (`\d` for digits, `\w` for word characters, `\s` for whitespace, `[a-z]` for ranges) and quantifiers (`+` for one or more, `*` for zero or more, `{n}` for exact counts) enclosed within literal forward slashes (`/pattern/flags`).

* **Email Validation (`test()`):**  
  The `test()` method returns `true` or `false` indicating whether a string matches a pattern. A regex pattern such as `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` validates whether a given email address contains a valid username, `@` symbol, domain name, and top-level domain extension.

* **Pattern Mining (`match()`):**  
  The `match()` method with the global flag (`/g`) searches a body of raw text and extracts all substrings matching specific regex patterns (e.g., extracting all email addresses, Indian phone numbers, and date formats like `DD/MM/YYYY`).

* **Text Tokenization & Word Analytics:**  
  Strings are tokenized into words using regular expressions (`split(/\s+/)`), stripped of punctuation, and categorized into length buckets (Short 1-3 chars, Medium 4-6 chars, Long 7+ chars) to plot structural word distribution charts.

**Output:**  
*(Insert your screenshot here)*

**Result:**  
A Text Mining & Regex Analytics Console was successfully developed. The application validates single email address inputs in real time, mines email addresses, phone numbers, and dates from raw paragraph text payloads, and computes word-length distribution statistics. All extraction regex patterns were verified with test text inputs.

**Conclusion:**  
Through this practical, the application of Regular Expressions for string validation and pattern extraction in JavaScript was mastered. The concepts of anchors, character classes, quantifiers, and regex methods (`test()`, `match()`) were understood as essential tools for data validation and text parsing.

---

## Experiment Number: 7

**Aim:**  
Demonstrate Document Object Model (DOM) manipulation, event listener binding, and DOM tree traversal properties (`children`, `parentElement`, `closest()`) to construct an Interactive Assessment Portal.

**Software/Tools Required:**  
Visual Studio Code, Live Server Extension, Google Chrome Browser, HTML5, CSS3, JavaScript (ES6)

**Theory:**  
The Document Object Model (DOM) is an object-oriented representation of an HTML document structure as a tree of nodes, enabling JavaScript to dynamically update content, structure, and style.

* **Dynamic Element Creation & Mutation:**  
  Elements are instantiated dynamically in memory using `document.createElement()`, configured with attributes and inner HTML, and inserted into the live page tree using `appendChild()` or `insertBefore()`. Elements are removed using `remove()`.

* **DOM Tree Traversal Properties:**  
  DOM traversal involves navigating relative relationships between parent, child, and sibling nodes:
  - `parentElement`: Navigates upward from a target child node to its immediate parent container.
  - `children`: Returns an HTMLCollection of immediate child elements of a target parent node.
  - `closest(selector)`: Traverses upward through ancestor nodes until it locates the nearest element matching a specified CSS selector.

* **Event Handling & Delegation:**  
  Event listeners (`addEventListener()`) capture user interactions such as button clicks and key presses, triggering handler functions to mutate state and log DOM execution execution paths.

**Output:**  
*(Insert your screenshot here)*

**Result:**  
An Interactive Task & Assessment Portal was successfully built. The application creates, updates, filters, and deletes task elements dynamically while outputting the exact DOM tree traversal steps (e.g., `button -> closest('li') -> remove()`) in a live monitor console. All DOM interactions were verified to work accurately.

**Conclusion:**  
Through this practical, DOM tree node manipulation and traversal properties (`parentElement`, `children`, `closest()`) were thoroughly understood. It was observed how relative DOM node navigation allows clean event handling without hardcoding element references.

---

## Experiment Number: 8

**Aim:**  
Implement HTML5 form validation, real-time input event listeners, regex pattern matching, and dynamic UI badge generation for a Gym Admission & Access Pass Portal.

**Software/Tools Required:**  
Visual Studio Code, Live Server Extension, Google Chrome Browser, HTML5, CSS3, JavaScript (ES6)

**Theory:**  
Form validation ensures user inputs meet required format, length, and numerical constraints before data submission, preventing invalid data entry.

* **Form Event Handling & Prevention:**  
  Form submission triggers a `submit` event. Calling `e.preventDefault()` prevents the default browser page reload, allowing JavaScript to validate fields asynchronously and update the UI in-place.

* **Real-time Input Validation:**  
  Field-level input listeners (`input`, `change`) inspect values dynamically as the user types:
  - **Name Validation:** Regular expression checking for minimum length and alphabetic characters (`/^[a-zA-Z\s]{3,}$/`).
  - **Age Validation:** Boundary inspection ensuring numerical values fall between 16 and 65.
  - **Phone Validation:** Regex verification enforcing exactly 10 numeric digits (`/^\d{10}$/`).
  - **Email Validation:** Standard email structure matching.

* **Dynamic UI State & Access Pass Compiler:**  
  When all validation constraints evaluate to `true`, the submit button is programmatically enabled. Upon form submission, input values and selected membership tiers are compiled into a digital member access pass featuring a unique generated member ID.

**Output:**  
*(Insert your screenshot here)*

**Result:**  
A Gym Admission & Digital Access Pass Portal was successfully created. The application validates user input fields in real time with visual status feedback, enables submission upon complete field compliance, and updates a digital membership badge with candidate information and unique member IDs.

**Conclusion:**  
Through this practical, client-side form validation mechanisms, real-time event monitoring, and dynamic UI state manipulation were mastered. The importance of input sanitization and immediate visual validation feedback for enhancing user experience was demonstrated.

---

## Experiment Number: 9

**Aim:**  
Implement `localStorage` and `sessionStorage` (Web Storage API) to save, retrieve, and clear user preference settings across browser sessions.

**Software/Tools Required:**  
Visual Studio Code, Live Server Extension, Google Chrome Browser, HTML5, CSS3, JavaScript (ES6)

**Theory:**  
The Web Storage API allows web applications to store key-value data locally within the user's browser, providing a lightweight alternative to HTTP cookies.

* **`localStorage` (Persistent Storage):**  
  Data stored in `localStorage` has no expiration time. It persists even when the browser window or computer is closed and reopened. It is ideal for storing permanent user choices, such as dark/light theme preferences.

* **`sessionStorage` (Session-Bound Storage):**  
  Data stored in `sessionStorage` exists only for the duration of the current page session (tab lifetime). Closing the tab or window wipes out the stored data. It is suitable for temporary tab states, such as temporary font scaling levels.

* **Web Storage API Methods:**  
  - `setItem(key, value)`: Saves a key-value string pair into storage.
  - `getItem(key)`: Retrieves the string value associated with a specified key.
  - `removeItem(key)`: Deletes a specific key-value pair from storage.
  - `clear()`: Purges all stored key-value entries from the storage object.

* **JSON Storage & Inspector:**  
  Web storage only stores strings. Objects are serialized to strings using `JSON.stringify()` before saving and parsed back into objects using `JSON.parse()`. Live code inspectors render the stored JSON data dynamically.

**Output:**  
*(Insert your screenshot here)*

**Result:**  
A System Preferences Console was successfully implemented using the Web Storage API. Dark mode preferences were configured to persist permanently via `localStorage`, while font scaling preferences were configured to persist per-tab session via `sessionStorage`. Live JSON monitors accurately displayed storage states, and a reset action successfully cleared all stored data.

**Conclusion:**  
Through this practical, the operational differences between `localStorage` and `sessionStorage` were understood. The ability to persist user settings across reloads using simple key-value storage methods was successfully applied.

---

## Experiment Number: 10

**Aim:**  
Implement Asynchronous JavaScript using the Fetch API and jQuery `$.getJSON()` to retrieve remote API data and render a dynamic developer directory with connection latency tracking.

**Software/Tools Required:**  
Visual Studio Code, Live Server Extension, Google Chrome Browser, HTML5, CSS3, JavaScript (ES6), jQuery 3.7.1

**Theory:**  
Asynchronous JavaScript allows web applications to request data from external servers in the background without freezing or reloading the user interface.

* **Asynchronous Programming & Promises:**  
  Asynchronous operations execute non-blockingly. JavaScript uses Promises to handle future asynchronous results through `.then()` fulfillment handlers and `.catch()` error handlers.

* **Fetch API:**  
  The native browser `fetch()` API returns a Promise that resolves to a Response object. Calling `res.json()` parses the JSON HTTP response payload asynchronously.
  ```javascript
  fetch(url)
    .then(response => response.json())
    .then(data => renderData(data));
  ```

* **jQuery `$.getJSON()`:**  
  `$.getJSON()` is a shorthand AJAX helper method provided by the jQuery library that performs HTTP GET requests expecting JSON responses and executes `.done()` callbacks upon completion.
  ```javascript
  $.getJSON(url).done(data => renderData(data));
  ```

* **Performance Latency Measurement:**  
  The `performance.now()` API records high-resolution timestamps before and after network request execution, allowing calculation of exact network roundtrip latency in milliseconds.

**Output:**  
*(Insert your screenshot here)*

**Result:**  
An Interactive Developer Directory & API Telemetry Engine was successfully created. The application fetches remote user payloads from a REST API endpoint using both native Fetch API and jQuery `$.getJSON()`, measures roundtrip latency, supports client-side search filtering, and displays execution code syntax.

**Conclusion:**  
Through this practical, asynchronous data fetching techniques using native Fetch API and jQuery `$.getJSON()` were mastered. The advantages of non-blocking network calls, promise handling, and dynamic JSON data rendering in modern single-page applications were fully appreciated.
