/* 
  ===== EXTERNAL JAVASCRIPT: Billing Calculator =====
  This file demonstrates:
    1) var vs let vs const (declaration & scope differences)
    2) Template literals (building strings/HTML dynamically)
    3) Destructuring (objects & arrays)
*/

// ----- VARIABLE DECLARATIONS -----

// "const" -> used for the bill array because we NEVER reassign the array
// itself (we only push/remove items inside it, the variable always points
// to the same array). const = "this identifier won't be reassigned".
const billItems = [];

// "let" -> used for values that CHANGE over time as the user adds items.
// let is block-scoped (only exists inside the { } it's declared in).
let subtotal = 0;
let taxAmount = 0;
let discountAmount = 0;
let grandTotal = 0;

// Constant business rules - these never change, so const is appropriate
const TAX_RATE = 0.05;           // 5% tax
const DISCOUNT_THRESHOLD = 1000; // discount applies if subtotal crosses this
const DISCOUNT_RATE = 0.10;      // 10% discount


// ----- FUNCTION: Add Item to Bill -----
function addItem() {
  // Grab raw values from input fields
  const nameInput = document.getElementById('itemName');
  const qtyInput = document.getElementById('itemQty');
  const priceInput = document.getElementById('itemPrice');

  const name = nameInput.value.trim();
  const qty = Number(qtyInput.value);
  const price = Number(priceInput.value);

  // Basic validation
  if (!name || qty <= 0 || price <= 0) {
    alert('⚠️ Please enter a valid item name, quantity, and price.');
    return;
  }

  // Create an item object and push it into our const array.
  // Note: pushing into the array does NOT reassign billItems,
  // so declaring it as const is perfectly valid.
  const amount = qty * price;
  billItems.push({ name, qty, price, amount }); // shorthand object property names (ES6)

  // Clear the input fields for the next entry
  nameInput.value = '';
  qtyInput.value = '';
  priceInput.value = '';
  nameInput.focus();

  renderBill();       // refresh the table
  calculateTotals();  // recalculate subtotal/tax/discount/total

  console.log('Item added:', { name, qty, price, amount });
}


// ----- FUNCTION: Remove Item from Bill -----
function removeItem(index) {
  billItems.splice(index, 1); // remove 1 item at the given index
  renderBill();
  calculateTotals();
}


// ----- FUNCTION: Render Bill Table using TEMPLATE LITERALS -----
function renderBill() {
  const billBody = document.getElementById('billBody');

  // If no items, show the empty message row
  if (billItems.length === 0) {
    billBody.innerHTML = `<tr id="emptyRow"><td colspan="5" class="empty-msg">No items added yet</td></tr>`;
    return;
  }

  // ".map()" transforms each item object into a table row string,
  // then ".join('')" merges all row strings into one big HTML string.
  // Template literals (backticks ` `) let us embed variables directly
  // using ${...} instead of clunky string concatenation with '+'.
  const rowsHtml = billItems.map((item, index) => {
    // ===== DESTRUCTURING an object =====
    // Instead of writing item.name, item.qty, item.price, item.amount
    // separately, we extract them all in one line:
    const { name, qty, price, amount } = item;

    return `
      <tr>
        <td>${name}</td>
        <td>${qty}</td>
        <td>₹${price}</td>
        <td>₹${amount}</td>
        <td><button class="remove-btn" onclick="removeItem(${index})">✕</button></td>
      </tr>
    `;
  }).join('');

  billBody.innerHTML = rowsHtml;
}


// ----- FUNCTION: Calculate Bill Totals -----
function calculateTotals() {
  // "let" is used inside here because these values are reassigned
  // every time this function runs (they depend on current billItems).

  // Recalculate subtotal using reduce() - sums up all item amounts
  subtotal = billItems.reduce((sum, item) => sum + item.amount, 0);

  taxAmount = subtotal * TAX_RATE;

  // Discount only applies if subtotal crosses the threshold
  discountAmount = subtotal >= DISCOUNT_THRESHOLD ? subtotal * DISCOUNT_RATE : 0;

  grandTotal = subtotal + taxAmount - discountAmount;

  // Package everything into one object so we can demonstrate destructuring
  // when we use these values below.
  const billSummary = { subtotal, taxAmount, discountAmount, grandTotal };

  // ===== DESTRUCTURING the summary object directly into variables =====
  const { subtotal: sub, taxAmount: tax, discountAmount: disc, grandTotal: total } = billSummary;

  // Update the UI using template literals for formatted currency strings
  document.getElementById('subtotalVal').textContent = `₹${sub.toFixed(2)}`;
  document.getElementById('taxVal').textContent = `₹${tax.toFixed(2)}`;
  document.getElementById('discountVal').textContent = `- ₹${disc.toFixed(2)}`;
  document.getElementById('totalVal').textContent = `₹${total.toFixed(2)}`;

  document.getElementById('discountNote').textContent =
    disc > 0 ? `(applied on bill above ₹${DISCOUNT_THRESHOLD})` : `(add items above ₹${DISCOUNT_THRESHOLD} to unlock)`;

  console.log('Bill Summary:', billSummary);
}


// ----- FUNCTION: var vs let Scope Demonstration -----
// This is the CLASSIC JavaScript interview example showing why "let" was
// introduced to fix a common bug caused by "var" in loops.
function runScopeDemo() {
  console.clear();
  console.log('%c--- var vs let Scope Demo ---', 'color:#0f9b8e; font-weight:bold;');

  // ===== Using "var" (function-scoped, NOT block-scoped) =====
  // All 3 setTimeout callbacks share the SAME "i" variable, because var
  // ignores the block { } of the for-loop. By the time the timeouts run,
  // the loop has already finished and "i" is 3 for all of them.
  console.log('Using var (buggy behaviour):');
  for (var i = 0; i < 3; i++) {
    setTimeout(function () {
      console.log(`  var i = ${i}`); // will print 3, 3, 3
    }, 100);
  }

  // ===== Using "let" (block-scoped) =====
  // "let" creates a NEW "j" for every single loop iteration, so each
  // setTimeout callback correctly remembers its own value of j.
  setTimeout(() => {
    console.log('Using let (correct behaviour):');
    for (let j = 0; j < 3; j++) {
      setTimeout(function () {
        console.log(`  let j = ${j}`); // will print 0, 1, 2
      }, 100);
    }
  }, 500);

  alert('✅ Scope demo running! Open DevTools Console (F12) to see the var vs let output.');
}