
/* const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  department: String,
  instructor: String,
  material: String,
  category: String,
  duration: String,
  rating: Number,
  modules:String
});

module.exports = mongoose.model('Course', courseSchema);
 */


// models/allCourse.js (Mongoose schema)
const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  courseName: String,
  courseDescription: String,
  courseCode: String,
  enrollPeriod: {
    startDate: Date,
    endDate: Date
  },
  modules: [
    {
      title: String,
      description: String
    }
  ],
  department: String,
  numberOfSeats: Number,
  instructorId: String,
    instructorName: String
});
module.exports = mongoose.model('Course', courseSchema);
