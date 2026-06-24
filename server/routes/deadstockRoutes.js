const express = require('express');
const router = express.Router();
const { getDeadStock, createDeadStock, updateDeadStock, getMonthlyReport, getYearlyReport } = require('../controllers/deadstockController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getDeadStock)
  .post(upload.single('image'), createDeadStock);

router.put('/:id', upload.single('image'), updateDeadStock);
router.get('/report/monthly', getMonthlyReport);
router.get('/report/yearly', getYearlyReport);

module.exports = router;
