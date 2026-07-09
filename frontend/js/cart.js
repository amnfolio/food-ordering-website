// cart.js - handles add/remove/update of cart items using localStorage

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    let cart = getCart();
    const existing = cart.find(i => i.id === itemId);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            emoji: item.emoji,
            qty: 1
        });
    }

    saveCart(cart);
    renderNavbar(); // update cart count badge
    alert(item.name + ' added to cart!');
}

function removeFromCart(itemId) {
    let cart = getCart().filter(i => i.id !== itemId);
    saveCart(cart);
    renderNavbar();
    renderCartPage();
}

function changeQty(itemId, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== itemId);
    }

    saveCart(cart);
    renderNavbar();
    renderCartPage();
}

function getCartTotal() {
    return getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
}

// ---------------- Renders the cart table on cart.html ----------------
function renderCartPage() {
    const tableBody = document.getElementById('cartTableBody');
    const emptyMsg = document.getElementById('emptyCartMsg');
    const summaryBox = document.getElementById('cartSummary');
    if (!tableBody) return; // not on cart page

    const cart = getCart();

    if (cart.length === 0) {
        tableBody.innerHTML = '';
        emptyMsg.classList.remove('hidden');
        summaryBox.classList.add('hidden');
        return;
    }

    emptyMsg.classList.add('hidden');
    summaryBox.classList.remove('hidden');

    tableBody.innerHTML = cart.map(item => `
        <tr>
            <td>${item.emoji} ${item.name}</td>
            <td>₹${item.price}</td>
            <td>
                <div class="qty-controls">
                    <button onclick="changeQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty('${item.id}', 1)">+</button>
                </div>
            </td>
            <td>₹${item.price * item.qty}</td>
            <td><button class="btn btn-small btn-outline" onclick="removeFromCart('${item.id}')">Remove</button></td>
        </tr>
    `).join('');

    const subtotal = getCartTotal();
    const deliveryFee = subtotal > 0 ? 30 : 0;
    const total = subtotal + deliveryFee;

    document.getElementById('subtotalAmount').textContent = '₹' + subtotal;
    document.getElementById('deliveryAmount').textContent = '₹' + deliveryFee;
    document.getElementById('totalAmount').textContent = '₹' + total;
}

document.addEventListener('DOMContentLoaded', renderCartPage);
