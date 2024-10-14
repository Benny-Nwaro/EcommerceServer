const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/keys");
const {check, validationResult} = require("express-validator");


router.get("/", (req, res) => res.send("requesting user page"));
router.post("/", [check("name", "Name is required").not().isEmpty(), 
    check("email", "Enter a valid email").isEmail(), 
    check("password", "Password should be at least 8 characters").isLength({min: 5})], 
    async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({errors : errors.array()})
        }
        try {
            console.log(req.body);
            const {name, email, password, role} = req.body;
            let user = await User.findOne({email});
            if(user){
               return res.json({errors: [{msg: "User already exists"}]}).status(400)
            }
            user = new User({
                name, email, password, role
            });
            
            //Hashing the password for storage
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            user.save();

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