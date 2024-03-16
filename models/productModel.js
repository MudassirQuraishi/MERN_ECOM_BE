const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    discountedPrice: {
        type: Number,
        required: true,
    },
    mainImage: {
        type: String,
        required: true,
    },
    sideImages: [
        {
            type: String,
            required: true,
        },
    ],
    tags: [
        {
            type: String,
            required: true,
        },
    ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
