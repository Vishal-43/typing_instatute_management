const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const FeeReceipt = require('../models/FeeReceipt');
const { uploadToS3 } = require('../services/s3Service');

const getStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', subject = '', isApproved } = req.query;
    const query = { isDeleted: false };

    if (subject) query.subject = subject;
    if (isApproved === 'true') query.isApproved = true;
    if (isApproved === 'false') query.isApproved = false;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { surname: { $regex: search, $options: 'i' } },
        { grNo: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: { students, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

const createStudent = async (req, res, next) => {
  try {
    const data = { ...req.body };

    const existing = await Student.findOne({ mobile: data.mobile, isDeleted: false });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Mobile number already exists' });
    }

    if (req.files?.photo) {
      const file = req.files.photo[0];
      const filename = `students/${Date.now()}-photo-${file.originalname}`;
      const filepath = path.join(__dirname, '../uploads', filename);
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, file.buffer);
      data.photoUrl = `/uploads/${filename}`;
    }

    if (req.files?.signature) {
      const file = req.files.signature[0];
      const filename = `students/${Date.now()}-sig-${file.originalname}`;
      const filepath = path.join(__dirname, '../uploads', filename);
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, file.buffer);
      data.signatureUrl = `/uploads/${filename}`;
    }

    const student = await Student.create(data);
    res.status(201).json({ success: true, data: student, message: 'Student created successfully' });
  } catch (err) {
    next(err);
  }
};

const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, isDeleted: false });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const enrollments = await Enrollment.find({ student: student._id }).populate('course');
    const receiptIds = enrollments.map(e => e._id);
    const feeReceipts = await FeeReceipt.find({ student: student._id }).populate('course').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { student, enrollments, feeReceipts },
    });
  } catch (err) {
    next(err);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    let student = await Student.findOne({ _id: req.params.id, isDeleted: false });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const data = { ...req.body };

    if (data.mobile && data.mobile !== student.mobile) {
      const existing = await Student.findOne({ mobile: data.mobile, _id: { $ne: req.params.id }, isDeleted: false });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Mobile number already exists' });
      }
    }

    if (req.files?.photo) {
      data.photoUrl = await uploadToS3(req.files.photo[0], 'students');
    }

    if (req.files?.signature) {
      data.signatureUrl = await uploadToS3(req.files.signature[0], 'students');
    }

    student = await Student.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: student, message: 'Student updated successfully' });
  } catch (err) {
    next(err);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const registerStudent = async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const session = (month >= 1 && month <= 6) ? 'June' : 'December';

    const { course, startDate, endDate, ...studentFields } = req.body;

    const existing = await Student.findOne({ mobile: studentFields.mobile, isDeleted: false });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Mobile number already exists' });
    }

    const studentData = {
      ...studentFields,
      grNo: studentFields.grNo || `REG-${Date.now()}`,
      instituteCode: studentFields.instituteCode || 'SELF',
      examSession: studentFields.examSession || session,
      dateOfAdmission: studentFields.dateOfAdmission || now,
    };

    const student = await Student.create(studentData);

    if (course && startDate) {
      const courseDoc = await require('../models/Course').findById(course);
      await Enrollment.create({
        student: student._id,
        course,
        startDate,
        endDate: endDate || startDate,
        courseFee: courseDoc ? courseDoc.feesAmount : 0,
      });
    }

    res.status(201).json({ success: true, data: student, message: 'Registration submitted successfully' });
  } catch (err) {
    next(err);
  }
};

const approveStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isApproved: req.body.isApproved },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student, message: `Student ${student.isApproved ? 'approved' : 'disapproved'}` });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStudents, createStudent, getStudent, updateStudent, deleteStudent, registerStudent, approveStudent };
