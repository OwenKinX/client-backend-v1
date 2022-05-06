const mongoose = require('mongoose')
const { MONGO_URI } = process.env
require('dotenv').config()

exports.connect = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
    }).then(() => {
        console.log('Database connected success');
    }).catch((error) => {
        console.log('Error connecting to database');
        console.error(error);
        process.exit(1)
    })
}