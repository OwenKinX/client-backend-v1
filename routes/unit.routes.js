const express = require("express");
const router = express.Router();
const PUnit = require('../model/Unit')
require("dotenv").config();
const logger = require('../utils/logger');

router.get('/units', async(req, res) => {
    PUnit.find().then(unit => {
        res.status(200).json({unit});
    }).catch(error => {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${error.status || 500} - ${res.statusMessage} - ${ error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    })
})

router.get('/unit/:id', async(req, res) => {
    PUnit.findOne({ id: req.params.id }).then(unit => {
        res.status(200).json({unit});
    }).catch(error => {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${error.status || 500} - ${res.statusMessage} - ${ error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    })
})

module.exports = router;