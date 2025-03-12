const express = require('express');
const Category = require('../models/category');

const router = express.Router();

/**
 * @swagger
 * /category/getAllCategories:
 *   get:
 *     description: Get a list of categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/getAllCategories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching categories', error: err.message });
    }
});

/**
 * @swagger
 * /category/createCategory:
 *   post:
 *     description: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/createCategory', async (req, res) => {
    const { name, description } = req.body;

    try {
        const newCategory = new Category({
            name,
            description,
        });

        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (err) {
        res.status(500).json({ message: 'Error creating category', error: err.message });
    }
});

module.exports = router;
