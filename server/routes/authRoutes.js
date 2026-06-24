const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, loginSchema } = require('../utils/validators');

router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

module.exports = router;
