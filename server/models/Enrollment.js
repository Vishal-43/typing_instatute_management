const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  courseFee: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
