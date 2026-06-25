const express = require('express');
const router = express.Router();
const { getFees, createFee, getFee, updateFee, getFeePDF } = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');
const { logAudit } = require('../middleware/auditLogger');

router.get('/:id/pdf', getFeePDF);

router.use(protect);

router.route('/')
  .get(getFees)
  .post(logAudit('CREATE_FEE', 'fees'), createFee);

router.route('/:id')
  .get(getFee)
  .put(logAudit('UPDATE_FEE', 'fees'), updateFee);

module.exports = router;
