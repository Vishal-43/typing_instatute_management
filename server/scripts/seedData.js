require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Enrollment = require('../models/Enrollment');
const FeeReceipt = require('../models/FeeReceipt');
const Result = require('../models/Result');
const Expense = require('../models/Expense');
const DeadStock = require('../models/DeadStock');
const VisitBook = require('../models/VisitBook');

const monthsAgo = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
};

const formatDate = (d) => d.toISOString().split('T')[0];

const coursesData = [
  { name: 'English Typing', language: 'English', duration: 3, feesAmount: 3000, description: 'Basic English typing course', isActive: true },
  { name: 'Marathi Typing', language: 'Marathi', duration: 3, feesAmount: 2500, description: 'Basic Marathi typing course', isActive: true },
  { name: 'Hindi Typing', language: 'Hindi', duration: 3, feesAmount: 2500, description: 'Basic Hindi typing course', isActive: true },
  { name: 'Advanced English', language: 'English', duration: 6, feesAmount: 5000, description: 'Advanced English typing with speed building', isActive: true },
  { name: 'All Languages', language: 'English', duration: 6, feesAmount: 7000, description: 'Comprehensive course covering all three languages', isActive: false },
];

const studentData = [
  { grNo: 'GR-2024-001', instituteCode: 'SELF', examSession: 'June', surname: 'Patil', firstName: 'Amit', fathersName: 'Sudhir', mothersName: 'Sunita', mobile: '9876543210', email: 'amit.p@email.com', permanentAddress: '123 Main St, Pune', residentialAddress: '123 Main St, Pune', schoolCollegeName: 'Pune University', qualification: 'Graduate', subject: 'English', dateOfBirth: monthsAgo(300), dateOfAdmission: monthsAgo(5), isApproved: true },
  { grNo: 'GR-2024-002', instituteCode: 'SELF', examSession: 'June', surname: 'Joshi', firstName: 'Priya', fathersName: 'Ramesh', mothersName: 'Anita', mobile: '9876543211', email: 'priya.j@email.com', permanentAddress: '456 Oak Ave, Mumbai', residentialAddress: '456 Oak Ave, Mumbai', schoolCollegeName: 'Mumbai College', qualification: 'Graduate', subject: 'Marathi', dateOfBirth: monthsAgo(290), dateOfAdmission: monthsAgo(4), isApproved: true },
  { grNo: 'GR-2024-003', instituteCode: 'SELF', examSession: 'December', surname: 'Sharma', firstName: 'Rahul', fathersName: 'Vijay', mothersName: 'Neha', mobile: '9876543212', email: 'rahul.s@email.com', permanentAddress: '789 Pine Rd, Nagpur', residentialAddress: '789 Pine Rd, Nagpur', schoolCollegeName: 'Nagpur University', qualification: 'Post Graduate', subject: 'Hindi', dateOfBirth: monthsAgo(280), dateOfAdmission: monthsAgo(3), isApproved: false },
  { grNo: 'GR-2024-004', instituteCode: 'SELF', examSession: 'June', surname: 'Deshmukh', firstName: 'Sneha', fathersName: 'Dilip', mothersName: 'Kavita', mobile: '9876543213', email: 'sneha.d@email.com', permanentAddress: '321 Elm St, Thane', residentialAddress: '321 Elm St, Thane', schoolCollegeName: 'Thane College', qualification: 'Graduate', subject: 'English', dateOfBirth: monthsAgo(310), dateOfAdmission: monthsAgo(6), isApproved: true },
  { grNo: 'GR-2024-005', instituteCode: 'SELF', examSession: 'December', surname: 'Kulkarni', firstName: 'Rohan', fathersName: 'Mahesh', mothersName: 'Shweta', mobile: '9876543214', email: 'rohan.k@email.com', permanentAddress: '654 Birch Ln, Nashik', residentialAddress: '654 Birch Ln, Nashik', schoolCollegeName: 'Nashik College', qualification: 'HSC', subject: 'English', dateOfBirth: monthsAgo(285), dateOfAdmission: monthsAgo(2), isApproved: true },
  { grNo: 'GR-2024-006', instituteCode: 'SELF', examSession: 'June', surname: 'More', firstName: 'Pooja', fathersName: 'Sanjay', mothersName: 'Deepa', mobile: '9876543215', email: 'pooja.m@email.com', permanentAddress: '987 Cedar Dr, Kolhapur', residentialAddress: '987 Cedar Dr, Kolhapur', schoolCollegeName: 'Kolhapur University', qualification: 'Graduate', subject: 'Marathi', dateOfBirth: monthsAgo(295), dateOfAdmission: monthsAgo(4), isApproved: true },
  { grNo: 'REG-1740000000001', instituteCode: 'SELF', examSession: 'June', surname: 'Yadav', firstName: 'Neha', fathersName: 'Suresh', mobile: '9876543216', email: 'neha.y@email.com', subject: 'Hindi', dateOfAdmission: monthsAgo(1), isApproved: false },
  { grNo: 'REG-1740000000002', instituteCode: 'SELF', examSession: 'December', surname: 'Gawande', firstName: 'Vikas', fathersName: 'Ashok', mobile: '9876543217', subject: 'English', dateOfAdmission: monthsAgo(1), isApproved: false },
];

const paymentModes = ['Cash', 'UPI', 'Bank Transfer'];
const expenseCategories = ['Rent', 'Electricity', 'Internet', 'Stationery', 'Maintenance', 'Salary', 'Marketing'];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne();
    if (!admin) {
      console.log('No admin found. Run seedAdmin.js first.');
      await mongoose.disconnect();
      process.exit(0);
    }

    await Promise.all([
      Course.deleteMany({}),
      Student.deleteMany({}),
      Enrollment.deleteMany({}),
      FeeReceipt.deleteMany({}),
      Result.deleteMany({}),
      Expense.deleteMany({}),
      DeadStock.deleteMany({}),
      VisitBook.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const courses = await Course.insertMany(coursesData);
    console.log(`Created ${courses.length} courses`);

    const students = await Student.insertMany(studentData);
    console.log(`Created ${students.length} students`);

    const enrollments = [];
    const feeReceipts = [];
    let receiptNum = 1;

    for (let i = 0; i < 5; i++) {
      const student = students[i];
      const course = courses[i % 4];
      const startDate = monthsAgo(5 - i);
      const end = new Date(startDate);
      end.setMonth(end.getMonth() + course.duration);
      const endDate = end;

      const enrollment = await Enrollment.create({
        student: student._id,
        course: course._id,
        startDate,
        endDate,
        courseFee: course.feesAmount,
      });
      enrollments.push(enrollment);

      const feeCount = Math.floor(Math.random() * 2) + 1;
      for (let f = 0; f < feeCount; f++) {
        const paid = f === 0 ? Math.floor(course.feesAmount * 0.5) : course.feesAmount - Math.floor(course.feesAmount * 0.5);
        await FeeReceipt.create({
          receiptNumber: `RC-${String(receiptNum++).padStart(4, '0')}`,
          student: student._id,
          course: course._id,
          startDate,
          endDate,
          amountPaid: paid,
          paymentDate: monthsAgo(5 - i - f),
          paymentMode: paymentModes[f % 3],
          createdBy: admin._id,
        });
      }
    }
    console.log(`Created ${enrollments.length} enrollments and receipts`);

    const results = await Result.insertMany([
      { examSession: 'June', year: 2024, subject: 'English', fileUrl: '#', remarks: 'June 2024 English results', uploadedBy: admin._id },
      { examSession: 'June', year: 2024, subject: 'Marathi', fileUrl: '#', remarks: 'June 2024 Marathi results', uploadedBy: admin._id },
      { examSession: 'December', year: 2024, subject: 'Hindi', fileUrl: '#', remarks: 'Dec 2024 Hindi results', uploadedBy: admin._id },
    ]);
    console.log(`Created ${results.length} results`);

    const expenses = [];
    for (let m = 0; m < 6; m++) {
      const cat = expenseCategories[m % expenseCategories.length];
      const amounts = { Rent: 15000, Electricity: 3500, Internet: 1500, Stationery: 2000, Maintenance: 4000, Salary: 25000, Marketing: 5000 };
      await Expense.create({
        category: cat,
        amount: amounts[cat] + Math.floor(Math.random() * 1000),
        description: `${cat} expense for month ${m + 1}`,
        expenseDate: monthsAgo(m),
        paymentMode: paymentModes[m % 3],
        createdBy: admin._id,
      });
    }
    console.log(`Created 6 expenses`);

    const deadStock = await DeadStock.insertMany([
      { assetName: 'Dell Desktop', assetCode: 'CPU-001', category: 'Computer', quantity: 2, purchaseDate: monthsAgo(24), deadStockDate: new Date(), reason: 'Not Working', remarks: 'Motherboard failure', status: 'Active' },
      { assetName: 'HP Monitor', assetCode: 'MON-001', category: 'Monitor', quantity: 1, purchaseDate: monthsAgo(18), deadStockDate: monthsAgo(1), reason: 'Damaged', remarks: 'Screen cracked', status: 'Active' },
      { assetName: 'Logitech Keyboard', assetCode: 'KBD-003', category: 'Keyboard', quantity: 5, purchaseDate: monthsAgo(12), deadStockDate: monthsAgo(1), reason: 'Damaged', remarks: 'Multiple keys not working', status: 'Disposed' },
      { assetName: 'Epson Printer', assetCode: 'PRN-001', category: 'Printer', quantity: 1, purchaseDate: monthsAgo(36), deadStockDate: monthsAgo(2), reason: 'Obsolete', remarks: 'Replaced with new model', status: 'Disposed' },
    ]);
    console.log(`Created ${deadStock.length} dead stock items`);

    const visitors = [
      { visitorName: 'Rajesh Kumar', phone: '9988776655', purpose: 'Admission', metPerson: 'Admin', checkIn: monthsAgo(0), vehicleNo: 'MH-12-AB-1234', remarks: 'Enquired about English typing course' },
      { visitorName: 'Sunita Patil', phone: '8877665544', purpose: 'Fee Payment', metPerson: 'Accountant', checkIn: monthsAgo(1), checkOut: monthsAgo(1), remarks: 'Paid fees for advanced course' },
      { visitorName: 'Amit Sharma', phone: '7766554433', purpose: 'Inquiry', metPerson: 'Admin', checkIn: monthsAgo(2), remarks: 'Asked about exam schedules' },
      { visitorName: 'Priya Deshmukh', phone: '6655443322', purpose: 'Meeting', metPerson: 'Director', checkIn: monthsAgo(3), checkOut: monthsAgo(3), idCardNo: 'ID-12345', remarks: 'Partnership discussion' },
    ];
    const visitEntries = visitors.map(v => ({ ...v, createdBy: admin._id }));
    await VisitBook.insertMany(visitEntries);
    console.log(`Created ${visitors.length} visit entries`);

    console.log('\n--- Seed Complete ---');
    console.log('Dashboard will now show populated data');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();
