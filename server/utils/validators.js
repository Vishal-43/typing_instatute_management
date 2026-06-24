const Joi = require('joi');

const studentSchema = Joi.object({
  grNo: Joi.string().required(),
  instituteCode: Joi.string().required(),
  examSession: Joi.string().valid('June', 'December').required(),
  surname: Joi.string().required(),
  firstName: Joi.string().required(),
  fathersName: Joi.string().allow(''),
  mothersName: Joi.string().allow(''),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Mobile number must be 10 digits',
  }),
  telephone: Joi.string().allow(''),
  email: Joi.string().email().allow(''),
  permanentAddress: Joi.string().allow(''),
  residentialAddress: Joi.string().allow(''),
  schoolCollegeName: Joi.string().allow(''),
  qualification: Joi.string().allow(''),
  identityType: Joi.string().allow(''),
  identityNumber: Joi.string().allow(''),
  dateOfBirth: Joi.date().allow(''),
  dateOfAdmission: Joi.date().required(),
  subject: Joi.string().valid('English', 'Marathi', 'Hindi').required(),
});

const courseSchema = Joi.object({
  name: Joi.string().required(),
  language: Joi.string().valid('English', 'Marathi', 'Hindi').required(),
  duration: Joi.number().integer().min(1).required(),
  description: Joi.string().allow(''),
  feesAmount: Joi.number().positive().required(),
  isActive: Joi.boolean(),
});

const enrollmentSchema = Joi.object({
  student: Joi.string().required(),
  course: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  courseFee: Joi.number().positive().required(),
});

const feeReceiptSchema = Joi.object({
  student: Joi.string().required(),
  course: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  amountPaid: Joi.number().positive().required(),
  paymentDate: Joi.date().required(),
  paymentMode: Joi.string().valid('Cash', 'UPI', 'Bank Transfer').required(),
  remarks: Joi.string().allow(''),
});

const resultSchema = Joi.object({
  examSession: Joi.string().valid('June', 'December').required(),
  year: Joi.number().integer().min(2000).max(2100).required(),
  subject: Joi.string().valid('English', 'Marathi', 'Hindi').required(),
  remarks: Joi.string().allow(''),
});

const deadStockSchema = Joi.object({
  assetName: Joi.string().required(),
  assetCode: Joi.string().required(),
  category: Joi.string().valid('Computer', 'CPU', 'Monitor', 'Keyboard', 'Mouse', 'Camera', 'Printer', 'UPS', 'Other').required(),
  quantity: Joi.number().integer().positive().required(),
  purchaseDate: Joi.date().allow(''),
  deadStockDate: Joi.date().required(),
  reason: Joi.string().valid('Damaged', 'Not Working', 'Obsolete', 'Broken', 'Scrap').required(),
  remarks: Joi.string().allow(''),
  status: Joi.string().valid('Active', 'Disposed'),
});

const expenseSchema = Joi.object({
  category: Joi.string().valid('Rent', 'Electricity', 'Internet', 'Stationery', 'Maintenance', 'Salary', 'Marketing', 'Other').required(),
  amount: Joi.number().positive().required(),
  description: Joi.string().allow(''),
  expenseDate: Joi.date().required(),
  paymentMode: Joi.string().valid('Cash', 'UPI', 'Bank Transfer').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const visitBookSchema = Joi.object({
  visitorName: Joi.string().required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Phone must be 10 digits',
  }),
  purpose: Joi.string().valid('Admission', 'Examination', 'Fee Payment', 'Inquiry', 'Meeting', 'Other').required(),
  metPerson: Joi.string().allow(''),
  checkIn: Joi.date().required(),
  checkOut: Joi.date().allow(''),
  vehicleNo: Joi.string().allow(''),
  idCardNo: Joi.string().allow(''),
  remarks: Joi.string().allow(''),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(e => ({
      field: e.path[0],
      message: e.message,
    }));
    return res.status(400).json({ success: false, message: 'Validation failed', errors });
  }
  next();
};

module.exports = {
  validate,
  studentSchema,
  courseSchema,
  enrollmentSchema,
  feeReceiptSchema,
  resultSchema,
  deadStockSchema,
  expenseSchema,
  loginSchema,
  visitBookSchema,
};
