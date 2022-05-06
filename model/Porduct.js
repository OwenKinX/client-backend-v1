const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({

    // 2
    pro_id: {
        type: Number,
        required: true,
        unique: true,
    },
    // 3
    name: {
        type: String,
        required: true,
    },
    // 4
    price: {
        type: Number,
        required: true,
    },
    // 5
    quantity: {
        type: Number,
        required: true,
    },
    // 6
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Types",
        required: true,
    },
    // 7
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Units",
        required: true,
    },
    // 8
    image: String,
});

const Product = mongoose.model("Products", ProductSchema);

module.exports = Product;
