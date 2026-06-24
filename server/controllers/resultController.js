const Result = require('../models/Result');
const { uploadToS3 } = require('../services/s3Service');

const getResults = async (req, res, next) => {
  try {
    const { year, examSession, subject } = req.query;
    const query = {};

    if (year) query.year = Number(year);
    if (examSession) query.examSession = examSession;
    if (subject) query.subject = subject;

    const results = await Result.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

const createResult = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'PDF file is required' });
    }

    const file = req.file;
    const session = req.body.examSession || 'June';
    const year = req.body.year || new Date().getFullYear();
    const subject = req.body.subject || 'English';
    const fileUrl = await uploadToS3(file, `results/${session}/${year}/${subject}`);

    const result = await Result.create({
      examSession: req.body.examSession,
      year: req.body.year,
      subject: req.body.subject,
      fileUrl,
      remarks: req.body.remarks,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, data: result, message: 'Result uploaded successfully' });
  } catch (err) {
    next(err);
  }
};

const viewResult = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    res.redirect(result.fileUrl);
  } catch (err) {
    next(err);
  }
};

const deleteResult = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Result not found' });
    }

    

    await Result.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Result deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getResults, createResult, viewResult, deleteResult };
