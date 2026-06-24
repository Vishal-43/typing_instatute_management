const Student = require('../models/Student');
const Course = require('../models/Course');
const FeeReceipt = require('../models/FeeReceipt');
const Result = require('../models/Result');
const DeadStock = require('../models/DeadStock');
const Expense = require('../models/Expense');
const Enrollment = require('../models/Enrollment');
const VisitBook = require('../models/VisitBook');

const getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const activeStudentIds = await Enrollment.distinct('student', { endDate: { $gte: now } });
    const activeStudents = activeStudentIds.length;
    const totalStudents = await Student.countDocuments({ isDeleted: false });
    const courses = await Course.countDocuments({ isActive: true });
    const feesResult = await FeeReceipt.aggregate([
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);
    const totalFees = feesResult.length > 0 ? feesResult[0].total : 0;
    const results = await Result.countDocuments();
    const deadStock = await DeadStock.countDocuments();
    const totalExpenses = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const expenseTotal = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
    const visits = await VisitBook.countDocuments();

    res.json({
      success: true,
      data: { activeStudents, totalStudents, courses, totalFees, results, deadStock, expenseTotal, visits },
    });
  } catch (err) {
    next(err);
  }
};

const getCharts = async (req, res, next) => {
  try {
    const monthlyFees = await FeeReceipt.aggregate([
      { $group: {
        _id: { year: { $year: '$paymentDate' }, month: { $month: '$paymentDate' } },
        total: { $sum: '$amountPaid' },
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const expensesByCategory = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);

    const enrollmentsOverTime = await Enrollment.aggregate([
      { $group: {
        _id: { year: { $year: '$startDate' }, month: { $month: '$startDate' } },
        count: { $sum: 1 },
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: { monthlyFees, expensesByCategory, enrollmentsOverTime },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats, getCharts };
