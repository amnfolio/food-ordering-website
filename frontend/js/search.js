// search.js - filters menuItems by name as the user types

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('searchInput');
    const grid = document.getElementById('searchResults');
    if (!input || !grid) return;

    function renderResults(query) {
        const q = query.trim().toLowerCase();

        if (q === '') {
            grid.innerHTML = '<p class="empty-msg">Start typing to search for food...</p>';
            return;
        }

        const results = menuItems.filter(item =>
            item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );

        if (results.length === 0) {
            grid.innerHTML = '<p class="empty-msg">No dishes found for "' + query + '"</p>';
            return;
        }

        grid.innerHTML = results.map(item => `
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
    }

    input.addEventListener('input', function () {
        renderResults(this.value);
    });

    // pre-fill from ?q= param (used when redirected from home page search bar)
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    if (initialQuery) {
        input.value = initialQuery;
    }
    renderResults(initialQuery);
});
