/**
 * Practical 5: Boutique Checkout & Array Telemetry
 */

document.addEventListener('DOMContentLoaded', () => {

    // Store Catalog items
    const products = [
        { id: 101, name: 'Silk Evening Scarf', category: 'Apparel', price: 2499, icon: 'fa-user-ninja' },
        { id: 102, name: 'Vintage Leather Tote', category: 'Leather', price: 8999, icon: 'fa-briefcase' },
        { id: 103, name: 'Cashmere Sweater', category: 'Apparel', price: 5499, icon: 'fa-shirt' },
        { id: 104, name: 'Artisan Sunglasses', category: 'Eyewear', price: 3299, icon: 'fa-glasses' },
        { id: 105, name: 'Velvet Tailored Blazer', category: 'Apparel', price: 11999, icon: 'fa-user-tie' },
        { id: 106, name: 'Minimal Gold Ring', category: 'Jewelry', price: 4199, icon: 'fa-gem' }
    ];

    const catalogContainer = document.getElementById('catalog-container');
    const receiptItemsContainer = document.getElementById('receipt-items-container');
    const receiptEmpty = document.getElementById('receipt-empty');

    const navCartCount = document.getElementById('nav-cart-count');
    const recSubtotal = document.getElementById('rec-subtotal');
    const recTax = document.getElementById('rec-tax');
    const recGrandtotal = document.getElementById('rec-grandtotal');
    const btnCheckout = document.getElementById('btn-checkout');

    // Telemetry text targets
    const telePush = document.getElementById('tele-push');
    const teleMap = document.getElementById('tele-map');
    const teleReduce = document.getElementById('tele-reduce');

    let cart = [];

    // Render store items
    renderCatalog();

    function renderCatalog() {
        catalogContainer.innerHTML = "";
        products.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="prod-header">
                    <div>
                        <h4 class="prod-title">${prod.name}</h4>
                        <span class="prod-cat">${prod.category}</span>
                    </div>
                    <i class="fa-solid ${prod.icon} text-muted"></i>
                </div>
                <div class="prod-price">₹${prod.price.toLocaleString('en-IN')}</div>
                <button class="btn-add-cart" data-id="${prod.id}">
                    <i class="fa-solid fa-cart-plus"></i> ADD TO BAG
                </button>
            `;

            card.querySelector('.btn-add-cart').addEventListener('click', () => {
                addToCart(prod);
            });

            catalogContainer.appendChild(card);
        });
    }

    // Array Method 1: Array.push()
    function addToCart(prod) {
        const existing = cart.find(item => item.id === prod.id);
        
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: prod.id,
                name: prod.name,
                price: prod.price,
                qty: 1
            });
        }

        telePush.textContent = `cart.push({ id: ${prod.id}, name: "${prod.name}" })`;
        updateReceipt();
    }

    // Array Method 2: Array.filter()
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateReceipt();
    }

    // Array Methods 3 & 4: Array.map() & Array.reduce()
    function updateReceipt() {
        receiptItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            receiptItemsContainer.appendChild(receiptEmpty);
            navCartCount.textContent = "0 Items";
            recSubtotal.textContent = "₹0.00";
            recTax.textContent = "₹0.00";
            recGrandtotal.textContent = "₹0.00";
            btnCheckout.disabled = true;

            teleMap.textContent = `cart.map(item => item.price * item.qty)`;
            teleReduce.textContent = `subtotal = cart.reduce(...) = ₹0`;
            return;
        }

        const totalItemsCount = cart.reduce((count, item) => count + item.qty, 0);
        navCartCount.textContent = `${totalItemsCount} Item${totalItemsCount > 1 ? 's' : ''}`;
        btnCheckout.disabled = false;

        // Render receipt rows
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            
            const row = document.createElement('div');
            row.className = 'receipt-item-row';

            row.innerHTML = `
                <div class="receipt-item-left">
                    <button class="btn-remove-item" data-id="${item.id}" title="Remove Item">&times;</button>
                    <span>${item.name} x${item.qty}</span>
                </div>
                <span>₹${itemTotal.toLocaleString('en-IN')}</span>
            `;

            row.querySelector('.btn-remove-item').addEventListener('click', () => {
                removeFromCart(item.id);
            });

            receiptItemsContainer.appendChild(row);
        });

        // Array.map() calculation telemetry
        const itemSums = cart.map(i => i.price * i.qty);
        teleMap.textContent = `[${itemSums.join(', ')}]`;

        // Array.reduce() calculation
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const tax = Math.round(subtotal * 0.18);
        const grandTotal = subtotal + tax;

        recSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        recTax.textContent = `₹${tax.toLocaleString('en-IN')}`;
        recGrandtotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

        teleReduce.textContent = `subtotal = cart.reduce(...) = ₹${subtotal.toLocaleString('en-IN')}`;
    }

    btnCheckout.addEventListener('click', () => {
        alert("🎉 Order Processed Successfully! Thank you for shopping with La Boutique.");
        cart = [];
        updateReceipt();
    });
});
