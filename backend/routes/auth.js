const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")

const JWT_SECRT = 'shhgsghs ssgjhsgs @'


//ROUTE:1  Create a user using: POST '/api/auth/'.   Doesn't require login Authentication..
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5 }),
], async (req, res) => {
  let success = false
  //if there are error send bad request
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
//check the user with the same email
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ error: 'sorry user already exists' })
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)
 //Create a new user   
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })

    const data = {
      user:{
        id:user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRT)
    success = true;
    res.json({success,authToken})
    // res.json(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).send("some error occured")
  }
})


// ROUTE:2 Authenticate a user using POST "/api/auth/login"  Doesn't require login Authentication..
router.post('/login', [
  body('email').isEmail(),
  body('password','Password can not be blank').exists(),
], async (req, res) => {
let success = false;
   //if there are error send bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password} = req.body;
    try {
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"please try to login with correct credential"})
      }

      const passwordCompare = await bcrypt.compare(password,user.password);
      if(!passwordCompare){
        success = false;
        return res.status(400).json({success,error:"please try to login with correct credential"})
      }

      const data = {
        user:{
          id:user.id
        }
      }
  
      const authToken = jwt.sign(data, JWT_SECRT)
      success = true;
      res.json({success,authToken})

    } catch (error) {
        console.log(error.message)
        res.status(500).send("some error occured") 
    }
})


// ROUTE:3 Get loggedin user Details using: POST "/api/auth/getuser"   Login Required
router.post('/getuser',fetchuser, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
    
  }catch (error) {
    console.log(error.message)
    res.status(500).send("some error occured") 
}
})


module.exports = router;