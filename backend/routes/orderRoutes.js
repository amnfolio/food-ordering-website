// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// ---------------- PLACE ORDER ----------------
router.post('/', verifyToken, async (req, res) => {
    try {
        const { items, totalAmount, address, phone, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty.' });
        }
        if (!address || !phone || !paymentMethod) {
            return res.status(400).json({ message: 'Address, phone and payment method are required.' });
        }

        const [result] = await db.query(
            'INSERT INTO orders (user_id, items, total_amount, address, phone, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, JSON.stringify(items), totalAmount, address, phone, paymentMethod]
        );

        res.status(201).json({ message: 'Order placed successfully!', orderId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not place order. Please try again.' });
    }
});

// ---------------- GET MY ORDERS ----------------
router.get('/my', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch orders.' });
    }
});

// ---------------- GET SINGLE ORDER ----------------
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Order not found.' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not fetch order.' });
    }
});

module.exports = router;
