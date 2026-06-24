const express = require('express');
const router = express.Router();
const { getVisits, createVisit, updateVisit, deleteVisit } = require('../controllers/visitBookController');
const { protect } = require('../middleware/authMiddleware');
const { logAudit } = require('../middleware/auditLogger');

router.use(protect);

router.route('/')
  .get(getVisits)
  .post(logAudit('CREATE_VISIT', 'visits'), createVisit);

router.route('/:id')
  .put(logAudit('UPDATE_VISIT', 'visits'), updateVisit)
  .delete(logAudit('DELETE_VISIT', 'visits'), deleteVisit);

module.exports = router;
