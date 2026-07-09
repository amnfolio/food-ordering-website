// common.js - injects navbar and footer on every page, and keeps cart count updated

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function renderNavbar() {
    const navEl = document.getElementById('navbar');
    if (!navEl) return;

    const loggedIn = isLoggedIn();

    navEl.innerHTML = `
        <div class="container nav-inner">
            <a href="index.html" class="logo">FoodExpress</a>
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="restaurants.html">Restaurants</a></li>
                <li><a href="offers.html">Offers</a></li>
                <li><a href="search.html">Search</a></li>
                <li><a href="cart.html" class="cart-link">Cart <span class="cart-count">${getCartCount()}</span></a></li>
                ${loggedIn
                    ? '<li><a href="profile.html">Profile</a></li><li><a href="#" id="logoutBtn">Logout</a></li>'
                    : '<li><a href="login.html">Login</a></li><li><a href="register.html">Register</a></li>'
                }
            </ul>
        </div>
    `;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
}

function renderFooter() {
    const footerEl = document.getElementById('footer');
    if (!footerEl) return;

    footerEl.innerHTML = `
        <div class="container">
            <p>&copy; 2026 FoodExpress. A student project built with HTML, CSS, JS &amp; MySQL.</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', function () {
    renderNavbar();
    renderFooter();
});
