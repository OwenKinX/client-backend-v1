const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require("body-parser")
const path = require('path')

const UserRoute = require('./routes/customer.routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(bodyParser.json())
app.use('/images',express.static(path.join(__dirname,'public/images')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
})

// Register
app.use('/customer', UserRoute);

module.exports = app;