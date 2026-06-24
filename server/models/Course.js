const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, enum: ['English', 'Marathi', 'Hindi'], required: true },
  duration: { type: Number, required: true },
  description: { type: String },
  feesAmount: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
