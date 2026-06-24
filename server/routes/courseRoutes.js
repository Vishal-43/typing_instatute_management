const express = require('express');
const router = express.Router();
const { getCourses, createCourse, updateCourse, toggleCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCourses)
  .post(protect, createCourse);

router.put('/:id', protect, updateCourse);
router.patch('/:id/toggle', protect, toggleCourse);

module.exports = router;
