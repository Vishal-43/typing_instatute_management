const express = require('express');
const router = express.Router();
const { createEnrollment, getEnrollmentsByStudent, updateEnrollment } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createEnrollment);
router.get('/student/:studentId', getEnrollmentsByStudent);
router.put('/:id', updateEnrollment);

module.exports = router;
