const jwt = require('jsonwebtoken')
const config = process.env

const checkAuth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, config.TOKEN_KEY)
        next();
    }catch(error){
        return res.status(401).json({ message: "[ ບໍ່ສາມາດອະນຸຍາດ / Authorization Failed! ]" });
    }
}
module.exports = checkAuth