# FoodExpress - Food Ordering Website

A multi-page food ordering website built with plain HTML, CSS and JavaScript
on the frontend, a small Node.js/Express server as the bridge to the
database, and MySQL for storing users and orders (used for login/register
and order history).

Note: a browser cannot talk to MySQL directly, so a tiny backend server is
required just to connect the two. Everything on the frontend is still plain
HTML/CSS/JS — no React, no Bootstrap, no frontend frameworks.

## Folder Structure

```
food-ordering-website/
├── backend/
│   ├── server.js            -> starts the server
│   ├── db.js                 -> MySQL connection
│   ├── middleware/auth.js    -> checks login token
│   ├── routes/
│   │   ├── authRoutes.js     -> register / login / profile
│   │   └── orderRoutes.js    -> place order / order history
│   ├── database/schema.sql   -> run this in MySQL first
│   ├── package.json
│   └── .env.example          -> rename to .env and fill your DB details
│
└── frontend/
    ├── index.html             -> Home
    ├── restaurants.html       -> Restaurants
    ├── pizza.html             -> Restaurants > Pizza
    ├── burger.html            -> Restaurants > Burger
    ├── biryani.html           -> Restaurants > Biryani
    ├── chinese.html           -> Restaurants > Chinese
    ├── offers.html             -> Offers
    ├── search.html             -> Search
    ├── cart.html                -> Cart
    ├── checkout.html            -> Checkout
    ├── order-success.html       -> Order Success
    ├── login.html                -> Login
    ├── register.html             -> Register
    ├── profile.html               -> Profile
    ├── css/style.css
    └── js/
        ├── common.js     -> navbar/footer + cart badge
        ├── menu-data.js  -> hardcoded menu items
        ├── cart.js       -> cart logic (localStorage)
        ├── auth.js       -> login/register form handling
        ├── home.js
        ├── category.js
        ├── search.js
        ├── offers.js
        ├── checkout.js
        └── profile.js
```

## How it works

- Menu items (pizza, burger, biryani, chinese) are hardcoded in
  `frontend/js/menu-data.js`. This keeps things simple, like a typical
  course project — no menu database table needed.
- The **cart** is stored in the browser's `localStorage`, so it persists
  even if you refresh the page.
- **Login/Register** and **Order History** are the parts that actually use
  MySQL, through the Express backend. Passwords are hashed with bcrypt, and
  a JWT token is issued on login and stored in `localStorage` to keep the
  user logged in.
- When you place an order at checkout, it's saved to the `orders` table in
  MySQL, linked to your user account, and you can see it later on your
  Profile page.

## Setup Instructions

### 1. Install MySQL and create the database

Open a terminal and run:

```
mysql -u root -p < backend/database/schema.sql
```

This creates the `food_ordering_db` database with `users` and `orders`
tables.

### 2. Configure the backend

```
cd backend
cp .env.example .env
```

Open `.env` and set your own `DB_PASSWORD` (and other DB details if
different from default), plus any `JWT_SECRET` string of your choice.

### 3. Install dependencies and start the server

```
npm install
npm start
```

You should see: `Server running at http://localhost:5000`

### 4. Open the website

Go to `http://localhost:5000` in your browser. The Express server serves
the frontend files directly, so both the site and the API run from the
same address (no CORS issues).

## Notes

- This is a learning/portfolio project — payment is simulated (no real
  payment gateway is integrated).
- Delivery fee is a flat ₹30 added at checkout.
- To add more menu items, just add more objects to the `menuItems` array
  in `frontend/js/menu-data.js`.
