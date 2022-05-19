const mongoose = require('mongoose')
const { MONGO_URI } = process.env
require('dotenv').config()

exports.connect = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
    }).then(() => {
        console.log("[ Database connected success ]");
    }).catch((error) => {
        console.log("[ Database connection failed ]");
        console.error(error);
        process.exit(1)
    })
}