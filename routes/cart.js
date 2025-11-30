const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const router = express.Router();

// Middleware to verify token (simplified)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
        req.userId = decoded.userId;
        next();
    });
};

const jwt = require('jsonwebtoken');

// Get Cart
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('cart.productId');
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add to Cart
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.userId);
        const itemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }
        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove from Cart
router.post('/remove', verifyToken, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await User.findById(req.userId);
        user.cart = user.cart.filter(item => item.productId.toString() !== productId);
        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
