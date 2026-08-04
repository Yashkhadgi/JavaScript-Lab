/* 
  ===== EXTERNAL JAVASCRIPT FILE =====
  This is the "best practice" way to write JS for real projects.
  It is linked in index.html via: <script src="script.js" defer></script>
  "defer" makes sure this file runs only AFTER the HTML has fully loaded.
*/

// Function triggered by the "Show Welcome Message" button
function showWelcomeMessage() {
  // Step 1: Grab values entered by the user from the input fields
  const name = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const age = document.getElementById('ageInput').value.trim();

  const resultBox = document.getElementById('resultBox');

  // Step 2: Basic validation - check if fields are empty
  if (!name || !email || !age) {
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = `⚠️ Please fill in all fields before continuing.`;
    console.warn('Form submitted with missing fields!'); // console.warn -> yellow warning in console
    return; // stop function execution here
  }

  // Step 3: Build the welcome message dynamically using template literals
  resultBox.classList.remove('hidden');
  resultBox.innerHTML = `
    👋 <strong>Welcome, ${name}!</strong><br>
    📧 Email: ${email}<br>
    🎂 Age: ${age}<br>
    ✅ Your info has been received successfully.
  `;

  // Step 4: Log the same info to the console for debugging purposes
  console.log('User Info Submitted:', { name, email, age });
}

// Function triggered by the "Run Console Methods Demo" button
// Demonstrates various built-in console methods and what they're used for
function runConsoleDemo() {

  // console.log() -> general purpose logging
  console.log('1) console.log(): General output for debugging.');

  // console.info() -> informational message (looks same as log in most browsers)
  console.info('2) console.info(): Used for informational messages.');

  // console.warn() -> shows a yellow warning icon in console
  console.warn('3) console.warn(): Used to highlight potential issues.');

  // console.error() -> shows a red error icon in console
  console.error('4) console.error(): Used to log errors.');

  // console.table() -> displays array/object data as a neat table
  console.table([
    { Name: 'Yash', Role: 'Student' },
    { Name: 'Claude', Role: 'Assistant' }
  ]);

  // console.group() and console.groupEnd() -> groups related logs together (collapsible)
  console.group('5) Grouped Logs Example');
  console.log('This log is nested inside a group.');
  console.log('So is this one.');
  console.groupEnd();

  // console.count() -> counts how many times this line has been called
  console.count('6) runConsoleDemo() called');

  // console.time() and console.timeEnd() -> measures how long a block of code takes
  console.time('7) Demo Execution Time');
  for (let i = 0; i < 1000000; i++) {} // dummy loop just to measure time
  console.timeEnd('7) Demo Execution Time');

  // console.assert() -> logs an error ONLY if the condition is false
  console.assert(1 + 1 === 3, '8) console.assert(): This assertion failed on purpose (1+1 is not 3)!');

  // Let the user know to check DevTools
  alert('✅ Console demo executed! Press F12 (or right-click → Inspect) and open the "Console" tab to see the output.');
}