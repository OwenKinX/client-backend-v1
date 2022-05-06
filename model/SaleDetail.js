const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SaleDetailSchema = new Schema({
    // 2
    quantity: {
        type: Number,
        required: true
    },
    // 3
    price: {
        type: Number,
        required: true
    },
    // 4
    date: {
        type: Date,
        required: true
    },
    // 5
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    // 6
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sales',
        required: true
    },
});

const SaleDetail = mongoose.model("SaleDetail", SaleDetailSchema);
module.exports = SaleDetail;
