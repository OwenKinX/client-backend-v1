const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const CustomersSchema = new mongoose.Schema({
    cus_id: {
        type: Number,
        default: 0,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname :{
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true        
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        province: String,
        district: String,
        village: String
    },
    image: {
        type: String
    },
    token: {
        type: String,
    },
})

// CustomersSchema.plugin(AutoIncrement)
CustomersSchema.plugin(AutoIncrement, {inc_field: 'cus_id'})

const Customers = mongoose.model('Customers', CustomersSchema);
module.exports = Customers;