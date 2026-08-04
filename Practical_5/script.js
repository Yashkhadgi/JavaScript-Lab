/**
 * Practical 5: La Boutique De Paris - Scandinavian Storefront Cart Engine
 */

document.addEventListener('DOMContentLoaded', () => {

    const products = [
        { id: 101, name: 'Eau De Parfum No. 5', category: 'Fragrance', price: 14500, img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80' },
        { id: 102, name: 'Cuir Vintage Handbag', category: 'Leather Goods', price: 89000, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80' },
        { id: 103, name: 'Soie Printed Silk Scarf', category: 'Accessories', price: 22500, img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80' },
        { id: 104, name: 'Chronographe Gold Ring', category: 'Jewelry', price: 45000, img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80' },
        { id: 105, name: 'Lunettes Solaires Noir', category: 'Eyewear', price: 31000, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80' },
        { id: 106, name: 'Blazer Laine Wool Jacket', category: 'Haute Couture', price: 120000, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80' }
    ];

    const productGrid = document.getElementById('product-grid-3col');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartEmptyState = document.getElementById('cart-empty-state');

    const bagCountPill = document.getElementById('bag-count-pill');
    const valSubtotal = document.getElementById('val-subtotal');
    const valTax = document.getElementById('val-tax');
    const valTotal = document.getElementById('val-total');
    const btnCheckout = document.getElementById('btn-checkout');

    let cart = [];

    renderCatalog();

    function renderCatalog() {
        productGrid.innerHTML = "";

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="product-img-wrap">
                    <img src="${p.img}" alt="${p.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <div>
                        <span class="product-cat">${p.category}</span>
                        <h4 class="product-title">${p.name}</h4>
                    </div>
                    <div class="product-bottom-row">
                        <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
                        <button class="btn-add-bag" data-id="${p.id}">Add to Bag</button>
                    </div>
                </div>
            `;

            card.querySelector('.btn-add-bag').addEventListener('click', () => {
                addToBag(p);
            });

            productGrid.appendChild(card);
        });
    }

    function addToBag(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                qty: 1
            });
        }

        updateReceipt();
    }

    function removeFromBag(id) {
        cart = cart.filter(item => item.id !== id);
        updateReceipt();
    }

    function updateReceipt() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.appendChild(cartEmptyState);
            bagCountPill.textContent = "0";
            valSubtotal.textContent = "₹0.00";
            valTax.textContent = "₹0.00";
            valTotal.textContent = "₹0.00";
            btnCheckout.disabled = true;
            return;
        }

        const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
        bagCountPill.textContent = totalQty;
        btnCheckout.disabled = false;

        cart.forEach(item => {
            const rowTotal = item.price * item.qty;

            const row = document.createElement('div');
            row.className = 'cart-row-item';

            row.innerHTML = `
                <div class="cart-row-left">
                    <button class="btn-rem-item" data-id="${item.id}">&times;</button>
                    <span>${item.name} &times; ${item.qty}</span>
                </div>
                <span class="val-price">₹${rowTotal.toLocaleString('en-IN')}</span>
            `;

            row.querySelector('.btn-rem-item').addEventListener('click', () => {
                removeFromBag(item.id);
            });

            cartItemsContainer.appendChild(row);
        });

        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const tax = Math.round(subtotal * 0.18);
        const grandTotal = subtotal + tax;

        valSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        valTax.textContent = `₹${tax.toLocaleString('en-IN')}`;
        valTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
    }

    btnCheckout.addEventListener('click', () => {
        alert("✨ Merci! Your order has been placed with La Boutique De Paris.");
        cart = [];
        updateReceipt();
    });
});
