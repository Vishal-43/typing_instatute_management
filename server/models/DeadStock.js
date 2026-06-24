const mongoose = require('mongoose');

const DeadStockSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  assetCode: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['Computer', 'CPU', 'Monitor', 'Keyboard', 'Mouse', 'Camera', 'Printer', 'UPS', 'Other'],
    required: true,
  },
  quantity: { type: Number, required: true },
  purchaseDate: { type: Date },
  deadStockDate: { type: Date, required: true },
  reason: {
    type: String,
    enum: ['Damaged', 'Not Working', 'Obsolete', 'Broken', 'Scrap'],
    required: true,
  },
  remarks: { type: String },
  imageUrl: { type: String },
  status: { type: String, enum: ['Active', 'Disposed'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('DeadStock', DeadStockSchema);
