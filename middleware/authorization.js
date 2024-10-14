const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config()

module.exports = (req, res, next)=>{
    const token = req.header("x-auth-token");
    const jwtSecret = process.env.ECOMMERCE_SECRET

    if(!token){
        return res.json({msg: "unauthorized access"}).status(401)
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.user;
        next();
        
    } catch (error) {
        return res.json({msg:"invalid token"}).status(401);
    }
}