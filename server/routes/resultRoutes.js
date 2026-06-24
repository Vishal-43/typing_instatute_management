const express = require('express');
const router = express.Router();
const { getResults, createResult, viewResult, deleteResult } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { logAudit } = require('../middleware/auditLogger');

router.use(protect);

router.route('/')
  .get(getResults)
  .post(upload.single('file'), logAudit('CREATE_RESULT', 'results'), createResult);

router.get('/:id/view', viewResult);
router.delete('/:id', logAudit('DELETE_RESULT', 'results'), deleteResult);

module.exports = router;
