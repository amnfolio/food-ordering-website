// category.js - renders menu items filtered by category
// Each category page sets window.CATEGORY before including this script

document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('menuGrid');
    if (!grid || !window.CATEGORY) return;

    function render(items) {
        if (items.length === 0) {
            grid.innerHTML = '<p class="empty-msg">No items found.</p>';
            return;
        }

        grid.innerHTML = items.map(item => `
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

    const items = menuItems.filter(i => i.category === window.CATEGORY);
    render(items);

    // sort tabs (price low-high / high-low)
    const tabs = document.querySelectorAll('.filter-tabs button');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const sort = this.dataset.sort;
            let sorted = [...items];
            if (sort === 'low') sorted.sort((a, b) => a.price - b.price);
            if (sort === 'high') sorted.sort((a, b) => b.price - a.price);
            render(sorted);
        });
    });
});
