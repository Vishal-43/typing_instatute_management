const Expense = require('../models/Expense');
const { uploadToS3, streamFromS3, extractKeyFromUrl } = require('../services/s3Service');

const getExpenses = async (req, res, next) => {
  try {
    const { category, startDate, endDate } = req.query;
    const query = {};
    if (category) query.category = category;
    if (startDate || endDate) {
      query.expenseDate = {};
      if (startDate) query.expenseDate.$gte = new Date(startDate);
      if (endDate) query.expenseDate.$lte = new Date(endDate);
    }
    const expenses = await Expense.find(query).sort({ expenseDate: -1 });
    res.json({ success: true, data: expenses });
  } catch (err) {
    next(err);
  }
};

const createExpense = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };

    if (req.file) {
      data.receiptUrl = await uploadToS3(req.file, 'expenses');
    }

    const expense = await Expense.create(data);
    res.status(201).json({ success: true, data: expense, message: 'Expense logged successfully' });
  } catch (err) {
    next(err);
  }
};

const updateExpense = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.receiptUrl = await uploadToS3(req.file, 'expenses');
    }

    const expense = await Expense.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense, message: 'Expense updated successfully' });
  } catch (err) {
    next(err);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getExpenseReceipt = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || !expense.receiptUrl) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    const key = extractKeyFromUrl(expense.receiptUrl);
    if (key) {
      await streamFromS3(key, res);
    } else {
      res.redirect(expense.receiptUrl);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseReceipt };
