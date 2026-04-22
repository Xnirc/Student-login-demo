const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret12345678910');

        // Attach student to request object
        req.student = await Student.findById(decoded.id);

        if (!req.student) {
            return res.status(401).json({ success: false, error: 'Student not found with this token' });
        }

        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }
};
