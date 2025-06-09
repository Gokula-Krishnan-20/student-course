const Course = require('../models/courseModel');

// GET all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET course by code
exports.getCourseByCode = async (req, res) => {
  try {
    const courseCode = req.params.code;
    const course = await Course.findOne({ code: courseCode }).populate('instructor');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// GET modules by course code
exports.getCourseModulesByCode = async (req, res) => {
  try {
    const course = await Course.findOne({ code: req.params.code });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Access the modules directly (not inside materials)
    res.json(course.modules);
  } catch (error) {
    console.error('Error in getCourseModulesByCode:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

