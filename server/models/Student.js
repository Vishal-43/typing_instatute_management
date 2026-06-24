const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  grNo: { type: String, required: true, unique: true },
  instituteCode: { type: String, required: true },
  examSession: { type: String, enum: ['June', 'December'], required: true },
  surname: { type: String, required: true },
  firstName: { type: String, required: true },
  fathersName: { type: String },
  mothersName: { type: String },
  mobile: { type: String, required: true, unique: true },
  telephone: { type: String },
  email: { type: String },
  permanentAddress: { type: String },
  residentialAddress: { type: String },
  schoolCollegeName: { type: String },
  qualification: { type: String },
  identityType: { type: String },
  identityNumber: { type: String },
  dateOfBirth: { type: Date },
  dateOfAdmission: { type: Date, required: true },
  subject: { type: String, enum: ['English', 'Marathi', 'Hindi'], required: true },
  photoUrl: { type: String },
  signatureUrl: { type: String },
  isApproved: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });


StudentSchema.index({ firstName: 'text', surname: 'text' });

module.exports = mongoose.model('Student', StudentSchema);
