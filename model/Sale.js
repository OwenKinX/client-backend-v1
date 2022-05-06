const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
    // 2
    invoice_no: {
        type: Number,
        required: true,
        unique: true
    },
    // 3
    type: {
        type: String,
        required: true
    },
    // 4
    status: {
        type: Boolean,
        default: false
    },
    // 5
    cash:{
        type: String,
    },
    // 6
    delivery: {
        type: Boolean,
        default: false
    },
    // 7
    place_deli:{
        type: String,
    },
    // 8
    deliver_cost:{
        type: Number,
    },
    // 9
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees',
        required: true
    },
    // 10
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
});

const Sale = mongoose.model("Sales", SaleSchema);
module.exports = Sale;