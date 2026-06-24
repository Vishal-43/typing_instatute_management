const FeeReceipt = require('../models/FeeReceipt');
const { generateReceiptNumber } = require('../utils/receiptNumberGenerator');
const { generateFeeReceiptPDF } = require('../services/pdfService');

const getFees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await FeeReceipt.countDocuments();
    const fees = await FeeReceipt.find()
      .populate('student', 'firstName surname grNo')
      .populate('course', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: { fees, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

const createFee = async (req, res, next) => {
  try {
    const receiptNumber = await generateReceiptNumber();
    const fee = await FeeReceipt.create({
      ...req.body,
      receiptNumber,
      createdBy: req.user._id,
    });
    const populated = await FeeReceipt.findById(fee._id)
      .populate('student', 'firstName surname grNo')
      .populate('course', 'name');

    res.status(201).json({ success: true, data: populated, message: 'Fee receipt created successfully' });
  } catch (err) {
    next(err);
  }
};

const getFee = async (req, res, next) => {
  try {
    const fee = await FeeReceipt.findById(req.params.id)
      .populate('student', 'firstName surname grNo mobile email')
      .populate('course', 'name duration');
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    res.json({ success: true, data: fee });
  } catch (err) {
    next(err);
  }
};

const updateFee = async (req, res, next) => {
  try {
    const fee = await FeeReceipt.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('student', 'firstName surname grNo')
      .populate('course', 'name');
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    res.json({ success: true, data: fee, message: 'Receipt updated successfully' });
  } catch (err) {
    next(err);
  }
};

const getFeePDF = async (req, res, next) => {
  try {
    const fee = await FeeReceipt.findById(req.params.id)
      .populate('student', 'firstName surname')
      .populate('course', 'name');

    if (!fee) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }

    const pdfData = {
      receiptNumber: fee.receiptNumber,
      studentName: `${fee.student?.firstName || ''} ${fee.student?.surname || ''}`,
      courseName: fee.course?.name || '',
      startDate: fee.startDate?.toLocaleDateString('en-IN'),
      endDate: fee.endDate?.toLocaleDateString('en-IN'),
      paymentDate: fee.paymentDate?.toLocaleDateString('en-IN'),
      amountPaid: fee.amountPaid,
      paymentMode: fee.paymentMode,
    };

    const pdfBytes = await generateFeeReceiptPDF(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${fee.receiptNumber}.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    next(err);
  }
};

module.exports = { getFees, createFee, getFee, updateFee, getFeePDF };
