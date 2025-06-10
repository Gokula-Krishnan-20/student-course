const mongoose = require('mongoose');

const instructorSchema = new mongoose.Schema({
/*   name: String,
  email: String,
  department: String,
  role: String,
  education: String,
  skill:String,
  experience:String */
  instructorId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  coursesTaken: { type: [String], default: [] }
});

module.exports = mongoose.model('Instructor', instructorSchema);
