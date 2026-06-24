require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@typing.in' });
    if (existing) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      process.exit(0);
    }

    const hashed = await bcrypt.hash('Admin@1234', 12);
    await User.create({
      name: 'Super Admin',
      email: 'admin@typing.in',
      password: hashed,
    });

    console.log('Admin seeded successfully');
    console.log('Email: admin@typing.in');
    console.log('Password: Admin@1234');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
