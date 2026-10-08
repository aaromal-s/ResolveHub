require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('./src/models/Department');

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/complaint_management';
    await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected for Seeding: ${mongoUri}`);

    const depts = [
      { name: 'Water & Sanitation', description: 'Water leaks, supply issues, sanitation.', headOfDept: 'John Doe' },
      { name: 'Roads & Infrastructure', description: 'Potholes, broken roads, bridges.', headOfDept: 'Jane Smith' },
      { name: 'Electricity & Power', description: 'Power cuts, broken streetlights.', headOfDept: 'Jim Beam' },
      { name: 'Waste Management', description: 'Garbage collection, public bins.', headOfDept: 'Jack Daniels' },
      { name: 'Parks & Recreation', description: 'Park maintenance, public spaces.', headOfDept: 'Johnny Walker' }
    ];

    await Department.deleteMany({});
    await Department.insertMany(depts);
    console.log('Departments Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding departments:', error);
    process.exit(1);
  }
};

seed();
