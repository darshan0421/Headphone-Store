const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
        req.userId = decoded.userId;
        next();
    });
};

// Checkout (Mock Payment)
router.post('/checkout', verifyToken, async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        // Simulate payment processing
        const isPaymentSuccessful = true; // Mock success

        if (isPaymentSuccessful) {
            const order = new Order({
                user: req.userId,
                items,
                totalAmount,
                shippingAddress,
                paymentStatus: 'Paid',
                orderStatus: 'Confirmed'
            });
            await order.save();

            // Clear user cart
            const user = await User.findById(req.userId);
            user.cart = [];
            await user.save();

            res.json({ message: 'Order placed successfully', orderId: order._id });
        } else {
            res.status(400).json({ error: 'Payment failed' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
