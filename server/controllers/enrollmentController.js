const Enrollment = require('../models/Enrollment');

const createEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.create(req.body);
    const populated = await Enrollment.findById(enrollment._id)
      .populate('student')
      .populate('course');
    res.status(201).json({ success: true, data: populated, message: 'Enrolled successfully' });
  } catch (err) {
    next(err);
  }
};

const getEnrollmentsByStudent = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId })
      .populate('course')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
};

const updateEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('student')
      .populate('course');
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }
    res.json({ success: true, data: enrollment, message: 'Enrollment updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createEnrollment, getEnrollmentsByStudent, updateEnrollment };
