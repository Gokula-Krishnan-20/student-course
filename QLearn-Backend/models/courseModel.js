const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  id: String, // 👈 manual ID like "mod1"
  title: String,
  description: String,
  pdfUrl: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  code: String,
  description: String,
  department: String,
  semester: String,
  credits: Number,
  level: String,
  prerequisites: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  createdAt: { type: Date, default: Date.now },
  modules: [moduleSchema]
});

module.exports = mongoose.model('Course', courseSchema , 'course');
// module.exports = courseModel;
