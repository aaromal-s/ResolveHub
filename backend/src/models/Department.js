const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a department name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    headOfDept: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Department', DepartmentSchema);
