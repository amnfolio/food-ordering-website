// home.js - renders a few featured items on the home page

document.addEventListener('DOMContentLoaded', function () {
    const featuredGrid = document.getElementById('featuredGrid');
    if (!featuredGrid) return;

    // pick first item of each category as "popular"
    const featured = ['p2', 'b2', 'r2', 'c3'].map(id => menuItems.find(i => i.id === id));

    featuredGrid.innerHTML = featured.map(item => `
        <div class="menu-card">
            <div class="emoji">${item.emoji}</div>
            <h3>${item.name}</h3>
            <p class="desc">${item.desc}</p>
            <p class="price">₹${item.price}</p>
            <div class="card-footer">
                <button class="btn btn-small" onclick="addToCart('${item.id}')">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // search bar on home page redirects to search.html with query
    const homeSearchForm = document.getElementById('homeSearchForm');
    if (homeSearchForm) {
        homeSearchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = document.getElementById('homeSearchInput').value.trim();
            window.location.href = 'search.html?q=' + encodeURIComponent(query);
        });
    }
});
