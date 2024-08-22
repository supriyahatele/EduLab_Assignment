require('dotenv').config()

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// register route
const RegisterUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    // Check if any field is missing or contains an invalid value
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    // Trim values to remove unnecessary whitespace
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
   

    // Check if any trimmed field is empty
    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
        return res.status(400).json({ msg: 'Fields cannot be empty or contain only whitespace' });
    }

    try {
        let user = await userModel.findOne({ email: trimmedEmail });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new userModel({ username: trimmedUsername, email: trimmedEmail, password: trimmedPassword, role});
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(trimmedPassword, salt);
        await user.save();

        return res.status(201).send({ msg: 'User registered successfully', user: user });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};



const Login = async (req, res) => {
    const { email, password } = req.body;

    // Check if email or password is missing or contains an invalid value
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    // Trim values to remove unnecessary whitespace
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // Check if any trimmed field is empty
    if (!trimmedEmail || !trimmedPassword) {
        return res.status(400).json({ msg: 'Fields cannot be empty or contain only whitespace' });
    }

    try {
        let user = await userModel.findOne({ email: trimmedEmail });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(trimmedPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { userId: user._id, role: user.role };
        jwt.sign(payload, process.env.SECRETKEY, { expiresIn: "12h" }, (err, token) => {
            if (err) throw err;
            return res.json({ token: token });
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server error');
    }
};


module.exports = { RegisterUser, Login }