const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// @route   GET /api/students
// @desc    Get all students
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        const students = await Student.find().select('-password');
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (err) {
        next(err);
    }
});

// @route   GET /api/students/me
// @desc    Get current logged in student
// @access  Private
router.get('/me', protect, async (req, res, next) => {
    try {
        const student = await Student.findById(req.student.id);

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (err) {
        next(err);
    }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
    try {
        let student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ success: false, error: `Student not found with id of ${req.params.id}` });
        }

        // Make sure user is not updating password directly here
        if (req.body.password) {
            delete req.body.password;
        }

        student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: student });
    } catch (err) {
        next(err);
    }
});

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ success: false, error: `Student not found with id of ${req.params.id}` });
        }

        await student.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
