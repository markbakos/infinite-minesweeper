const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const router = express.Router();
const authenticateToken = require('../authMiddleware.js');

router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    const existingUser = await User.findOne({username});
    if (existingUser) {
        return res.status(400).json({message: 'Username already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword
    });

    try {
        await user.save();
        res.status(201).json({message: 'User registered successfully'});
    }
    catch (e) {
        res.status(500).json( {message: 'Internal Server Error'});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});
    if(!user) {
        return res.status(400).json({message: 'Invalid credentials'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign(
        { id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'});

    res.json( {token});
});

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.id}. You have access to this resource`});
});

router.get('/verify', (req,res) => {
    const token = req.headers.authorization?.split(' ')[1]
    if(!token) {
        return res.status(401).json({message: 'Access Denied: No Token Provided'});
    }
    try{
        return res.status(200).json({ message: 'Token is valid'})
    }
    catch (e) {
        return res.status(401).json( { message: 'Invalid Token' });
    }
})

module.exports = router;