const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Helper to get token from model, create cookie and send response
const sendTokenResponse = (student, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET || 'supersecret12345678910', {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        student: {
            id: student._id,
            name: student.name,
            email: student.email
        }
    });
};

// @route   POST /api/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Create student
        const student = await Student.create({
            name,
            email,
            password
        });

        sendTokenResponse(student, 201, res);
    } catch (err) {
        next(err);
    }
});

// @route   POST /api/login
// @desc    Login student
// @access  Public
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for student
        const student = await Student.findOne({ email }).select('+password');

        if (!student) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await student.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(student, 200, res);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
