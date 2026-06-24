const Course = require('../models/Course');

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ success: true, data: courses });
  } catch (err) {
    next(err);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course, message: 'Course created successfully' });
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.json({ success: true, data: course, message: 'Course updated successfully' });
  } catch (err) {
    next(err);
  }
};

const toggleCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    course.isActive = !course.isActive;
    await course.save();
    res.json({ success: true, data: course, message: `Course ${course.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses, createCourse, updateCourse, toggleCourse };
