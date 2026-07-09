// profile.js - loads profile info and order history from the backend

document.addEventListener('DOMContentLoaded', async function () {
    const profileBox = document.getElementById('profileBox');
    if (!profileBox) return;

    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const res = await fetch('/api/auth/profile', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const user = await res.json();

        if (!res.ok) {
            alert('Session expired. Please login again.');
            logout();
            return;
        }

        profileBox.innerHTML = `
            <div class="row"><span>Name</span><span>${user.name}</span></div>
            <div class="row"><span>Email</span><span>${user.email}</span></div>
            <div class="row"><span>Phone</span><span>${user.phone || '-'}</span></div>
            <div class="row"><span>Address</span><span>${user.address || '-'}</span></div>
        `;

        loadOrders(token);

    } catch (err) {
        profileBox.innerHTML = '<p class="empty-msg">Could not connect to server.</p>';
    }
});

async function loadOrders(token) {
    const ordersEl = document.getElementById('orderHistory');
    if (!ordersEl) return;

    try {
        const res = await fetch('/api/orders/my', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const orders = await res.json();

        if (!res.ok || orders.length === 0) {
            ordersEl.innerHTML = '<p class="empty-msg">No orders placed yet.</p>';
            return;
        }

        ordersEl.innerHTML = orders.map(order => {
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            const itemsText = items.map(i => `${i.name} x ${i.qty}`).join(', ');
            const date = new Date(order.created_at).toLocaleDateString();

            return `
                <div class="order-history-item">
                    <div class="top-row">
                        <span>Order #${order.id}</span>
                        <span class="status-badge">${order.status}</span>
                    </div>
                    <p>${itemsText}</p>
                    <p>Total: ₹${order.total_amount} &middot; ${date}</p>
                </div>
            `;
        }).join('');

    } catch (err) {
        ordersEl.innerHTML = '<p class="empty-msg">Could not load orders.</p>';
    }
}
