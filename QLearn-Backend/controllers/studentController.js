const Student = require('../models/studentModel');
const Course = require('../models/courseModel');

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

const updateStudentById = async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: req.params.studentId },
      req.body,
      { new: true }
    );
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
};


const enrollInCourse = async (req, res) => {
  try {
    const { studentId, courseCode } = req.params;
    const student = await Student.findOne({ studentId });
    const course = await Course.findOne({ courseCode });

    if (!student || !course) return res.status(404).json({ error: 'Student or Course not found' });

    const now = new Date();
    if (now < new Date(course.enrollPeriod.startDate) || now > new Date(course.enrollPeriod.endDate)) {
      return res.status(400).json({ error: 'Enrollment period closed' });
    }

    if (course.numberOfSeats <= 0) {
      return res.status(400).json({ error: 'No seats available' });
    }

    if (student.enrolledCourses.includes(courseCode)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    if (student.enrolledCourses.length >= 6) {
      return res.status(400).json({ error: 'Enrollment limit reached. You can enroll in a maximum of 6 courses.' });
    }

    student.enrolledCourses.push(courseCode);
    course.numberOfSeats -= 1;

    await student.save();
    await course.save();

    res.json({ enrolledCourses: student.enrolledCourses });
  } catch (error) {
    res.status(500).json({ error: 'Enrollment failed' });
  }
};

// Unenroll student from course
const unenrollCourse = async (req, res) => {
  try {
    const { studentId, courseCode } = req.params;
    const student = await Student.findOne({ studentId });
    const course = await Course.findOne({ courseCode });

    if (!student || !course) return res.status(404).json({ error: 'Student or Course not found' });

    if (!student.enrolledCourses.includes(courseCode)) {
      return res.status(400).json({ error: 'Student is not enrolled in this course' });
    }

    student.enrolledCourses = student.enrolledCourses.filter(code => code !== courseCode);
    course.numberOfSeats += 1;

    await student.save();
    await course.save();

    res.json({ message: 'Unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Unenrollment failed' });
  }
};

// Get enrolled courses of student
const getEnrolledCourses = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student.enrolledCourses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudentById,
  enrollInCourse,
  unenrollCourse,
  getEnrolledCourses,
};