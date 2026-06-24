const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const feeRoutes = require('./routes/feeRoutes');
const resultRoutes = require('./routes/resultRoutes');
const deadstockRoutes = require('./routes/deadstockRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const visitBookRoutes = require('./routes/visitBookRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map(s => s.trim()).map(s => s.startsWith('http') ? s : `https://${s}`)
    : (process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173'),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'TIMS API is running', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/enrollments', enrollmentRoutes);
app.use('/api/v1/fees', feeRoutes);
app.use('/api/v1/results', resultRoutes);
app.use('/api/v1/deadstock', deadstockRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/visits', visitBookRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

app.use(errorHandler);

module.exports = app;
