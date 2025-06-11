const Course = require('../models/courseModel');

exports.getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

exports.getCourseByCode = async (req, res) => {
  try {
    const course = await Course.findOne({ courseCode: req.params.code });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getModulesByCourseCode = async (req, res) => {
  const course = await Course.findOne({ courseCode: req.params.code });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course.modules);
};

exports.getPaginatedCourses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const courses = await Course.find().skip(skip).limit(limit);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
