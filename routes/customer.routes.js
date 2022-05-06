const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

require("dotenv").config();
require("../config/db").connect();
const Customer = require("../model/Customer");
const auth = require("../middleware/auth");
const logger = require('../utils/logger')


const multer = require('multer');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('ປະເພດໄຟລ໌ຮູບພາບບໍ່ຖືກຕ້ອງ / Invalid mime type: .jpg, .png. jpeg')

        if(isValid){
            error = null
        }
        cb(null, "public/images/");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];

        // const today = new Date().toUTCString()
        // const yyyy = today.getFullYear();
        // let mm = today.getMonth() + 1;
        // let dd = today.getDate();
        // const now = `${dd}-${mm}-${yyyy}`;
        // const d = new Date();
        // let today = d.toISOString();
    
        cb(null, `${Date.now()}-${name}.${ext}`)
    }
})

// Register route
router.post("/register", multer({storage: storage}).single("image"), async (req, res) => {
    try {
        // Get all input
        const { cus_id, name, surname, phone, email, password, dob, gender, province, district, village } = req.body;
        const url = `${req.protocol}://${req.get('host')}`;
        const image = `${url}/images/${req.file.filename}`

        if (!req.body) {
            res.status(400).send("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ / All input is required");
            logger.error(`${err.status || 400} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        }
        // get exiting customer
        const exitCustomer = await Customer.findOne({ email });
        if (exitCustomer) {
            return res.status(409).send("ມີບັນຊີນີ້ໃນລະບົບແລ້ວ / This user is already exit, Please login");
        }
        
        // Encrypt password
        hashPassword = await bcrypt.hash(password, 10);

        // Insert data
        const user = await Customer.create({
            cus_id,
            name,
            surname,
            phone,
            email: email.toLowerCase(),
            password: hashPassword,
            dob,
            gender,
            address: {
                province,
                district,
                village,
            },
            image,
        });

        // create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            { expiresIn: "2h" }
        );

        // Save user token
        user.token = token;
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
});


// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ / All input is required");
        }
        // Validate if user exist in our database
        const user = await Customer.findOne({ email });
        const MacthPassword = await bcrypt.compare(password, user.password);
        //
        if (user && MacthPassword) {
            // create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                { expiresIn: "2h",}
            );
            // save token
            user.token = token;
            res.status(200).json(user);
        } else if( email != user ){
            res.status(401).send("ບັນຊີຜູ້ໃຊ້ຂອງທ່ານບໍ່ຖືກຕ້ອງ / Username is incorrect");
        }

        // end 
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
});

// get single user document
router.get("/profile/:email", async (req, res) => {
    try {
        const { email } = req.params;
        if (email) {
            const user = await Customer.findOne({ email });
            res.status(200).json(user);
        } else {
            res.status(400).send("Can not find this email in database");
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
});

// Update user
router.put('/update/:email', multer({storage: storage}).single("image"), async(req, res, next) => {
    try{
        const { cus_id, name, surname, phone, email, password, dob, gender, province, district, village } = req.body;
        const url = `${req.protocol}://${req.get('host')}`
        const image = `${url}/images/${req.file.filename}`

        if (req.body) {
            res.status(500).send("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ / All input is required");
        }
        // get exiting customer
        const exitCustomer = await Customer.findOne({ email });
        if (exitCustomer) {
            hashPassword = await bcrypt.hash(password, 10);
            // Insert data
            const user = await Customer.updateOne({
                cus_id,
                name,
                surname,
                phone,
                email: email.toLowerCase(),
                password: hashPassword,
                dob,
                gender,
                address: {
                    province,
                    district,
                    village,
                },
                image,
            });
            res.status(200).json(user);
        }
        
    }catch(error){
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${err.status || 500} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
})

router.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙏👍✅");
});

module.exports = router;