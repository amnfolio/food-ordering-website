// checkout.js - handles the checkout form and places the order via API

document.addEventListener('DOMContentLoaded', function () {
    const summaryEl = document.getElementById('orderSummary');
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) return;

    const cart = getCart();

    // if cart is empty, send back to cart page
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    // if not logged in, send to login and remember to come back here
    if (!isLoggedIn()) {
        sessionStorage.setItem('redirectAfterLogin', 'checkout.html');
        alert('Please login to continue checkout.');
        window.location.href = 'login.html';
        return;
    }

    const subtotal = getCartTotal();
    const deliveryFee = 30;
    const total = subtotal + deliveryFee;

    summaryEl.innerHTML = cart.map(item => `
        <div class="item-row">
            <span>${item.emoji} ${item.name} x ${item.qty}</span>
            <span>₹${item.price * item.qty}</span>
        </div>
    `).join('') + `
        <div class="item-row"><span>Delivery Fee</span><span>₹${deliveryFee}</span></div>
        <div class="item-row" style="font-weight:bold; border-top:1px solid #eee; padding-top:8px;">
            <span>Total</span><span>₹${total}</span>
        </div>
    `;

    // pre-fill address/phone from saved user info
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
        if (savedUser.address) document.getElementById('address').value = savedUser.address;
        if (savedUser.phone) document.getElementById('phone').value = savedUser.phone;
    }

    checkoutForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const msgEl = document.getElementById('formMsg');
        msgEl.textContent = '';
        msgEl.className = 'form-msg';

        const address = document.getElementById('address').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const paymentMethod = document.getElementById('paymentMethod').value;

        const token = localStorage.getItem('token');

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    items: cart,
                    totalAmount: total,
                    address,
                    phone,
                    paymentMethod
                })
            });

            const data = await res.json();

            if (!res.ok) {
                msgEl.textContent = data.message || 'Could not place order.';
                msgEl.classList.add('error');
                return;
            }

            // clear cart and go to success page
            localStorage.removeItem('cart');
            localStorage.setItem('lastOrderId', data.orderId);
            localStorage.setItem('lastOrderTotal', total);
            window.location.href = 'order-success.html';

        } catch (err) {
            msgEl.textContent = 'Could not connect to server. Is the backend running?';
            msgEl.classList.add('error');
        }
    });
});
