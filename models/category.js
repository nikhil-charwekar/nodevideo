const mongoose = require('mongoose');

// Define the category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Make sure the category name is unique
        trim: true,   // Remove extra spaces
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model for Category
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
