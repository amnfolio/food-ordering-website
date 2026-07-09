// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../db');
const verifyToken = require('../middleware/auth');

// ---------------- REGISTER ----------------
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required.' });
        }

        // check if user already exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone || '', address || '']
        );

        res.status(201).json({ message: 'Registration successful! Please login.', userId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful!',
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
});

// ---------------- GET PROFILE ----------------
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?',
            [req.user.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'User not found.' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

// ---------------- UPDATE PROFILE ----------------
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { phone, address } = req.body;
        await db.query('UPDATE users SET phone = ?, address = ? WHERE id = ?', [phone || '', address || '', req.user.id]);
        res.json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

module.exports = router;
