const FeeReceipt = require('../models/FeeReceipt');

const generateReceiptNumber = async () => {
  const lastReceipt = await FeeReceipt.findOne({})
    .sort({ createdAt: -1 })
    .select('receiptNumber');

  if (!lastReceipt || !lastReceipt.receiptNumber) return 'REC-000001';

  const lastNumber = parseInt(lastReceipt.receiptNumber.split('-')[1], 10);
  const nextNumber = String(lastNumber + 1).padStart(6, '0');
  return `REC-${nextNumber}`;
};

module.exports = { generateReceiptNumber };
