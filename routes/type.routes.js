const express = require("express");
const router = express.Router();
const PType = require('../model/Type');
const logger = require("../utils/logger");
require("dotenv").config();

router.get('/types', async(req, res) => {
    PType.find().then(type => {
        res.status(200).json({type});
    }).catch(error => {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${error.status || 500} - ${res.statusMessage} - ${ error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    })
})

// get single category type
router.get('/type/:id', async(req, res) => {
    PType.findOne({ id: req.params.id }).then(type => {
        res.status(200).json({type});
    }).catch(error => {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${error.status || 500} - ${res.statusMessage} - ${ error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    })
})

module.exports = router;