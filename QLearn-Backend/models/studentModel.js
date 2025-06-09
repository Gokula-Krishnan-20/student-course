const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  name: String,
  department: String,
  email: String,
  enrolledCourses: [String],
});

module.exports = mongoose.model('Student', StudentSchema);
