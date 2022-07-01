const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');


//create a user using: POST "/api/auth/createuser" . No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password must be at least 8 characters').isLength({ min: 8 }),    

], async (req, res) => {

    //If there are errors,return bad request and the errors
    const errors  = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check whether the user with this email exists already
    let user = User.findOne({email: req.body.email});

    if(user){
        return res.status(400).json({error: "Sorry a user with this email already exitsts"})
    }
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
    //   .then(user => res.json(user))
    //   .catch(err=> {console.log(err)
    // res.json({error: 'Please Enter a unique value for email', message: err.message})})

  

})

module.exports = router