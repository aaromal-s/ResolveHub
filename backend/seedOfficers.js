require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Department = require('./src/models/Department');

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaint_management';
    await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected for Seeding Officers: ${mongoUri}`);

    const departments = await Department.find();
    if (departments.length === 0) {
      console.log('No departments found. Please seed departments first.');
      process.exit(1);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('officer123', salt);

    const officers = departments.map((dept, index) => ({
      name: `Officer ${index + 1} (${dept.name})`,
      email: `officer${index + 1}@resolvehub.com`,
      password: hashedPassword,
      role: 'officer',
      department: dept._id
    }));

    // Optionally add one admin
    officers.push({
      name: 'System Admin',
      email: 'admin@resolvehub.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Clean up old officers/admins before inserting
    await User.deleteMany({ role: { $in: ['officer', 'admin'] } });
    
    await User.insertMany(officers);
    console.log('Officers and Admin Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding officers:', error);
    process.exit(1);
  }
};

seed();
