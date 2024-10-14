const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorization");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");
const {check, validationResult} = require("express-validator");

router.get("/", auth ,async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
    }
    

});

router.post("/", [
    check("email", "Enter a valid email").isEmail(), 
    check("password", "Invalid username or password").exists()], 
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({errors : errors.array()})
        }
        try {
            const {email, password} = req.body;
            let user = await User.findOne({email});
            if(!user){
               return res.json({errors: [{msg: "Invalid username or password"}]}).status(400)
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                return res.json({msg: "Invalid username or password"}).status(400)

            }
 
            //Generating jwt token
            const payLoad = {
                user: {
                    id : user.id
                }
            }
            jwt.sign(payLoad, config.jwtSecret, {expiresIn: 3600 * 24}, (err, token) =>{
                if(err) throw err;
                res.json({token});

            });

            // res.send("User added successfully");
            
        } catch (error) {
            console.error(error);
            res.status(500).send("server failed");
            
        }
    
    
})

module.exports = router;