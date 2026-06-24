const mongoose = require('mongoose');

const VisitBookSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  phone: { type: String, required: true },
  purpose: {
    type: String,
    enum: ['Admission', 'Examination', 'Fee Payment', 'Inquiry', 'Meeting', 'Other'],
    required: true,
  },
  metPerson: { type: String },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  vehicleNo: { type: String },
  idCardNo: { type: String },
  remarks: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('VisitBook', VisitBookSchema);
