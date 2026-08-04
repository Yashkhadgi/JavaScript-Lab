/**
 * Practical 5: La Boutique De Paris - Vogue Luxury Editorial Cart
 */

document.addEventListener('DOMContentLoaded', () => {

    const luxuryProducts = [
        { id: 201, name: 'Eau De Parfum No. 5', category: 'Fragrance', price: 14500, img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80' },
        { id: 202, name: 'Cuir Vintage Handbag', category: 'Leather Goods', price: 89000, img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80' },
        { id: 203, name: 'Soie Printed Silk Scarf', category: 'Accessories', price: 22500, img: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&q=80' },
        { id: 204, name: 'Chronographe Gold Ring', category: 'Jewelry', price: 45000, img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80' },
        { id: 205, name: 'Lunettes Solaires Noir', category: 'Eyewear', price: 31000, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80' },
        { id: 206, name: 'Blazer Laine Wool Jacket', category: 'Haute Couture', price: 120000, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80' }
    ];

    const catalogGrid = document.getElementById('luxury-catalog-grid');
    const receiptItemsContainer = document.getElementById('receipt-items-container');
    const emptyReceiptMsg = document.getElementById('empty-receipt-msg');

    const vogueBagCount = document.getElementById('vogue-bag-count');
    const recSubtotal = document.getElementById('rec-subtotal');
    const recTax = document.getElementById('rec-tax');
    const recGrandtotal = document.getElementById('rec-grandtotal');
    const btnCheckout = document.getElementById('btn-checkout');

    const telePush = document.getElementById('tele-push');
    const teleMap = document.getElementById('tele-map');
    const teleReduce = document.getElementById('tele-reduce');

    let cart = [];

    renderCatalog();

    function renderCatalog() {
        catalogGrid.innerHTML = "";

        luxuryProducts.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'vogue-product-card';

            card.innerHTML = `
                <div class="card-img-wrap">
                    <img src="${prod.img}" alt="${prod.name}" loading="lazy">
                </div>
                <div class="card-details-box">
                    <span class="item-cat-lbl">${prod.category}</span>
                    <h4 class="item-title">${prod.name}</h4>
                    <div class="item-price-row">
                        <span class="price-tag">₹${prod.price.toLocaleString('en-IN')}</span>
                        <button class="btn-add-bag" data-id="${prod.id}">ADD TO BAG</button>
                    </div>
                </div>
            `;

            card.querySelector('.btn-add-bag').addEventListener('click', () => {
                addToBag(prod);
            });

            catalogGrid.appendChild(card);
        });
    }

    function addToBag(prod) {
        const existing = cart.find(i => i.id === prod.id);
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

    function removeFromBag(id) {
        cart = cart.filter(i => i.id !== id);
        updateReceipt();
    }

    function updateReceipt() {
        receiptItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            receiptItemsContainer.appendChild(emptyReceiptMsg);
            vogueBagCount.textContent = "0 ITEMS";
            recSubtotal.textContent = "₹0.00";
            recTax.textContent = "₹0.00";
            recGrandtotal.textContent = "₹0.00";
            btnCheckout.disabled = true;

            teleMap.textContent = `cart.map(i => i.price * i.qty)`;
            teleReduce.textContent = `subtotal = cart.reduce(...) = ₹0`;
            return;
        }

        const totalItemsCount = cart.reduce((c, i) => c + i.qty, 0);
        vogueBagCount.textContent = `${totalItemsCount} ITEM${totalItemsCount > 1 ? 'S' : ''}`;
        btnCheckout.disabled = false;

        cart.forEach(item => {
            const itemTotal = item.price * item.qty;

            const row = document.createElement('div');
            row.className = 'receipt-row-item';

            row.innerHTML = `
                <div>
                    <button class="btn-rem-item" data-id="${item.id}">&times;</button>
                    <span>${item.name} x${item.qty}</span>
                </div>
                <span>₹${itemTotal.toLocaleString('en-IN')}</span>
            `;

            row.querySelector('.btn-rem-item').addEventListener('click', () => {
                removeFromBag(item.id);
            });

            receiptItemsContainer.appendChild(row);
        });

        const itemSums = cart.map(i => i.price * i.qty);
        teleMap.textContent = `[${itemSums.join(', ')}]`;

        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const tax = Math.round(subtotal * 0.18);
        const grandTotal = subtotal + tax;

        recSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        recTax.textContent = `₹${tax.toLocaleString('en-IN')}`;
        recGrandtotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;

        teleReduce.textContent = `subtotal = cart.reduce(...) = ₹${subtotal.toLocaleString('en-IN')}`;
    }

    btnCheckout.addEventListener('click', () => {
        alert("✨ MERCI! Your order has been placed with La Boutique De Paris.");
        cart = [];
        updateReceipt();
    });
});
