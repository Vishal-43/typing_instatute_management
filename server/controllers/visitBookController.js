const VisitBook = require('../models/VisitBook');

const getVisits = async (req, res, next) => {
  try {
    const { purpose, startDate, endDate } = req.query;
    const query = {};
    if (purpose) query.purpose = purpose;
    if (startDate || endDate) {
      query.checkIn = {};
      if (startDate) query.checkIn.$gte = new Date(startDate);
      if (endDate) query.checkIn.$lte = new Date(endDate);
    }
    const visits = await VisitBook.find(query).sort({ checkIn: -1 });
    res.json({ success: true, data: visits });
  } catch (err) {
    next(err);
  }
};

const createVisit = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };
    const visit = await VisitBook.create(data);
    res.status(201).json({ success: true, data: visit, message: 'Visit logged successfully' });
  } catch (err) {
    next(err);
  }
};

const updateVisit = async (req, res, next) => {
  try {
    const visit = await VisitBook.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.json({ success: true, data: visit, message: 'Visit updated successfully' });
  } catch (err) {
    next(err);
  }
};

const deleteVisit = async (req, res, next) => {
  try {
    const visit = await VisitBook.findByIdAndDelete(req.params.id);
    if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });
    res.json({ success: true, message: 'Visit deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getVisits, createVisit, updateVisit, deleteVisit };
