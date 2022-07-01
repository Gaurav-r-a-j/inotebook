const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'harryisagoodboy';


//create a user using: POST "/api/auth/createuser" . No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password must be at least 8 characters').isLength({ min: 8 }),

], async (req, res) => {

    //If there are errors,return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exitsts" })
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password,salt);

        //Create a new User
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken= jwt.sign(data, JWT_SECRET);
        
        
        res.json({authToken});

        // res.json(user)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured");
    }

})

//create a user using: POST "/api/auth/createuser" . No login required







module.exports = router












//for authentication  we use a package called as express validator 
//for hasing password we use a package called as bcryptjs
//we use jsonwebtoken for authentication