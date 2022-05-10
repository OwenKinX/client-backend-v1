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
        cb(null, `${Date.now()}-${name}.${ext}`)
    }
})

// Register route
router.post("/register", multer({storage: storage}).single("image"), async (req, res) => {
    try {
        // Get all input
        const { cus_id, name, surname, phone, email, password, dob, gender, province, district, village } = req.body;
        const url = `${req.protocol}://${req.get('host')}`;
        const image = `${url}/images/${req.file.filename}`;

        if (!req.body) {
            res.status(400).send("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ / All input is required");
            logger.error(`${err.status || 400} - ${res.statusMessage} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return;
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
        
        return res.status(200).send([user, "ລົງທະບຽນສຳເລັດ / Successfully registered"]);

    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
});


// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!req.body) {
            return res.status(400).send("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ / All input is required");
        }
        const user = await Customer.findOne({ email });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            // create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                { expiresIn: "2h",}
            );
            // save token
            user.token = token;
            return res.status(200).json({ token:token, message: "ເຂົ້າສູ່ລະບົບສຳເລັດ / Login success" });
        } else if( email != user ) {
            return res.status(401).send("ອີເມວ ຫຼື ລະຫັດຜ່ານຂອງທ່ານບໍ່ຖືກຕ້ອງ / Invalid email or password");
        }

        // end 
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
});

// get single user document
router.get("/profile/:email", async (req, res) => {
    try {
        const { email } = req.params;
        if (email) {
            const user = await Customer.findOne({ email });
            return res.status(200).json(user);
        } else {
            return res.status(400).send("ບໍ່ພົບບັນຊີນີ້ໃນລະບົບ / Can not find this user in database");
        }
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
});

// Update user
router.put('/update/:cus_id', multer({storage: storage}).single("image"), async(req, res, next) => {
    try{
        const { name, surname, phone, email, password, dob, gender, province, district, village } = req.body;
        const url = `${req.protocol}://${req.get('host')}`
        const image = `${url}/images/${req.file.filename}`

        if (!req.body) {
            res.status(500).send("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ / All input is required");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await Customer.findByIdAndUpdate(req.params.cus_id, 
            {
                cus_id, name, surname, phone, email: email.toLowerCase(), password: hashPassword, dob, gender, province, district, village, image
            },{ new: true }
        )
        res.status(200).send([user, "ອັບເດດຂໍ້ມູນສຳເລັດ / Update success"]);
        
    }catch(error){
        res.status(500).send(error.message);
        console.log(error);
        logger.error(`${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
})

router.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙏👍✅");
});

module.exports = router;