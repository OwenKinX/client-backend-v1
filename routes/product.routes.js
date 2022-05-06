const express = require("express");
const router = express.Router();

require("dotenv").config();
require("../config/db").connect();

const Product = require('../model/Porduct');
const logger = require('../utils/logger');

router.get('/', async(req, res) => {
    try {
        const product = await Product.find();
        if (product) {
            res.status(200).send(product)
        }else{
            res.status(404).send("ບໍ່ພົບຂໍ້ມູນ // Not Found");
            logger.error(`404 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
})

router.get('/:pro_id', async(req, res) => {
    try {
        const pro_id = req.params.pro_id;
        const product = await Product.findOne({pro_id});
        if (product) {
            res.status(200).send(product)
        }else{
            res.status(404).send("ບໍ່ພົບຂໍ້ມູນ // Not Found");
            logger.error(`404 || ${res.statusMessage} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
})

module.exports = router