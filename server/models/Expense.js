const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Rent', 'Electricity', 'Internet', 'Stationery', 'Maintenance', 'Salary', 'Marketing', 'Other'],
    required: true,
  },
  amount: { type: Number, required: true },
  description: { type: String },
  expenseDate: { type: Date, required: true },
  paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer'], required: true },
  receiptUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
