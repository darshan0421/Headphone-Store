const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Seed Products
router.get('/seed', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count > 0) {
            return res.json({ message: 'Products already seeded' });
        }

        const products = [
            { name: 'Bluetooth Headphone', price: 100, image: 'assets/header.png', description: 'Premium Bluetooth headphones' },
            { name: 'JBL Model 00035', price: 120, image: 'assets/store-1.png', description: 'JBL Beats Design' },
            { name: 'JBL Model 00045', price: 130, image: 'assets/store-2.png', description: 'JBL Beats Design' },
            { name: 'JBL Model 00025', price: 110, image: 'assets/store-3.png', description: 'JBL Beats Design' },
            { name: 'JBL Model 00055', price: 140, image: 'assets/store-4.png', description: 'JBL Beats Design' },
            { name: 'JBL Model 00015', price: 100, image: 'assets/store-5.png', description: 'JBL Beats Design' },
            { name: 'JBL Model 00065', price: 150, image: 'assets/store-6.png', description: 'JBL Beats Design' }
        ];

        await Product.insertMany(products);
        res.json({ message: 'Products seeded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
