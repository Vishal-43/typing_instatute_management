const express = require('express');
const router = express.Router();
const { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseReceipt } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { logAudit } = require('../middleware/auditLogger');

router.get('/:id/receipt', getExpenseReceipt);

router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(upload.single('receipt'), logAudit('CREATE_EXPENSE', 'expenses'), createExpense);

router.route('/:id')
  .put(upload.single('receipt'), logAudit('UPDATE_EXPENSE', 'expenses'), updateExpense)
  .delete(logAudit('DELETE_EXPENSE', 'expenses'), deleteExpense);

module.exports = router;
