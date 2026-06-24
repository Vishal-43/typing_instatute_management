const mongoose = require('mongoose');

const FeeReceiptSchema = new mongoose.Schema({
  receiptNumber: { type: String, unique: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer'], required: true },
  remarks: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('FeeReceipt', FeeReceiptSchema);
