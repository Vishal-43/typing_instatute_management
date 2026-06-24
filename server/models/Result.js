const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  examSession: { type: String, enum: ['June', 'December'], required: true },
  year: { type: Number, required: true },
  subject: { type: String, enum: ['English', 'Marathi', 'Hindi'], required: true },
  fileUrl: { type: String, required: true },
  remarks: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

ResultSchema.index({ year: 1, examSession: 1, subject: 1 });

module.exports = mongoose.model('Result', ResultSchema);
