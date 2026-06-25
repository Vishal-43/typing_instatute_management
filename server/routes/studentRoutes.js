const express = require('express');
const router = express.Router();
const { getStudents, createStudent, getStudent, updateStudent, deleteStudent, registerStudent, approveStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { logAudit } = require('../middleware/auditLogger');
const { validate, studentSchema, registerStudentSchema } = require('../utils/validators');

router.post('/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
]), validate(registerStudentSchema), registerStudent);

router.use(protect);

router.route('/')
  .get(getStudents)
  .post(upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
  ]), validate(studentSchema), logAudit('CREATE_STUDENT', 'students'), createStudent);

router.patch('/:id/approve', approveStudent);

router.route('/:id')
  .get(getStudent)
  .put(upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
  ]), validate(studentSchema), logAudit('UPDATE_STUDENT', 'students'), updateStudent)
  .delete(logAudit('DELETE_STUDENT', 'students'), deleteStudent);

module.exports = router;
