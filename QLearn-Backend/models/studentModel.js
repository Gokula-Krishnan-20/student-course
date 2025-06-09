// models/studentModel.js
const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  courseId: String,
  completedModules: [String],
  lastAccessed: Date
});

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  studentId: String,
  department: String,
  phone: String,
  enrolledCourses: [String],
  progress: [progressSchema]
});

module.exports =  mongoose.model('Student', studentSchema, 'student');
