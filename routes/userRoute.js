const express = require('express');
const { RegisterUser, Login } = require('../controllers/userController');
const UserRouter = express.Router();


// to register 
UserRouter.post('/register',  RegisterUser)

// to login the user

UserRouter.post('/login', Login)


module.exports ={UserRouter}