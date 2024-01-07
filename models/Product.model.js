const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    img_url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
});

const ProductModel = mongoose.model('products', productSchema);

module.exports = ProductModel;
