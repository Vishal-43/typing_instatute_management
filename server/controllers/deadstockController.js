const DeadStock = require('../models/DeadStock');
const { generateDeadStockExcel, generateDeadStockPDF } = require('../services/excelService');
const fs = require('fs');
const path = require('path');

const getDeadStock = async (req, res, next) => {
  try {
    const records = await DeadStock.find().sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
};

const createDeadStock = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      const file = req.file;
      const filename = `deadstock/${data.assetCode}/${Date.now()}-${file.originalname}`;
      const filepath = path.join(__dirname, '../uploads', filename);
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, file.buffer);
      data.imageUrl = `/uploads/${filename}`;
    }

    const record = await DeadStock.create(data);
    res.status(201).json({ success: true, data: record, message: 'Dead stock entry created' });
  } catch (err) {
    next(err);
  }
};

const updateDeadStock = async (req, res, next) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      const file = req.file;
      const filename = `deadstock/${data.assetCode || req.params.id}/${Date.now()}-${file.originalname}`;
      const filepath = path.join(__dirname, '../uploads', filename);
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, file.buffer);
      data.imageUrl = `/uploads/${filename}`;
    }

    const record = await DeadStock.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Dead stock record not found' });
    }
    res.json({ success: true, data: record, message: 'Dead stock entry updated' });
  } catch (err) {
    next(err);
  }
};

const getMonthlyReport = async (req, res, next) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const records = await DeadStock.find({
      deadStockDate: { $gte: start, $lte: end },
    }).sort({ deadStockDate: -1 });

    const format = req.query.format || 'pdf';
    const period = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;

    if (format === 'excel') {
      const buffer = await generateDeadStockExcel(records, period);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=deadstock-monthly-${period.replace(/ /g, '_')}.xlsx`);
      return res.send(Buffer.from(buffer));
    }

    const pdfBytes = await generateDeadStockPDF(records, period);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=deadstock-monthly-${period.replace(/ /g, '_')}.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    next(err);
  }
};

const getYearlyReport = async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const start = new Date(Number(year), 0, 1);
    const end = new Date(Number(year) + 1, 0, 1);

    const records = await DeadStock.find({
      deadStockDate: { $gte: start, $lte: end },
    }).sort({ deadStockDate: -1 });

    const format = req.query.format || 'pdf';
    const period = `Year ${year}`;

    if (format === 'excel') {
      const buffer = await generateDeadStockExcel(records, period);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=deadstock-yearly-${year}.xlsx`);
      return res.send(Buffer.from(buffer));
    }

    const pdfBytes = await generateDeadStockPDF(records, period);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=deadstock-yearly-${year}.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    next(err);
  }
};

module.exports = { getDeadStock, createDeadStock, updateDeadStock, getMonthlyReport, getYearlyReport };
