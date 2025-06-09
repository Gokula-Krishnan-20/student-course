const Student = require('../models/studentModel');
const Course = require('../models/courseModel'); // ✅ Access to course collection

// Get all students
exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  const student = await Student.findOne({ studentId: req.params.studentId });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
};

// ✅ Get enrolled courses with full course details
exports.getEnrolledCourses = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const courses = await Course.find({ code: { $in: student.enrolledCourses } });
    res.json({ enrolledCourses: courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error });
  }
};

// ✅ Get progress for a course with optional course info
exports.getProgress = async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const progress = student.progress.find(p => p.courseId === req.params.courseId);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    const course = await Course.findOne({ code: req.params.courseId });

    res.json({ progress, course });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error });
  }
};

// Update progress
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, completedModules, lastAccessed } = req.body;
    const studentId = req.params.studentId;

    if (!courseId || !Array.isArray(completedModules)) {
      return res.status(400).json({ message: 'Invalid courseId or completedModules' });
    }

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const index = student.progress.findIndex(p => p.courseId === courseId);
    const updatedLastAccessed = lastAccessed || new Date();

    if (index >= 0) {
      student.progress[index].completedModules = completedModules;
      student.progress[index].lastAccessed = updatedLastAccessed;
    } else {
      student.progress.push({ courseId, completedModules, lastAccessed: updatedLastAccessed });
    }

    await student.save();
    res.json({ message: 'Progress updated', progress: student.progress });

  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // ✅ De-duplicate enrolledCourses
    student.enrolledCourses = Array.from(new Set([...student.enrolledCourses, courseId]));
    await student.save();

    return res.json({ enrolledCourses: student.enrolledCourses });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error enrolling course' });
  }
};



// Update module completion
exports.updateModuleCompletion = async (req, res) => {
  const { studentId, courseId, moduleId } = req.params;

  try {
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    let progressEntry = student.progress.find(p => p.courseId === courseId);

    if (!progressEntry) {
      progressEntry = {
        courseId,
        completedModules: [],
        lastAccessed: new Date()
      };
      student.progress.push(progressEntry);
    }

    if (!progressEntry.completedModules.includes(moduleId)) {
      progressEntry.completedModules.push(moduleId);
      progressEntry.lastAccessed = new Date();
    }

    await student.save();

    res.json({ message: 'Module marked as completed', progress: progressEntry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update student profile/details
exports.updateStudentDetails = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const updatedData = req.body;

    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: studentId },
      updatedData,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unenrollCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Find student by studentId
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove courseId from enrolledCourses array
    student.enrolledCourses = student.enrolledCourses.filter(cId => cId !== courseId);

    await student.save();

    res.json({
      message: `Course ${courseId} successfully removed from enrolled courses.`,
      enrolledCourses: student.enrolledCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getEnrolledCourseDetails = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const courses = await Course.find({ code: { $in: student.enrolledCourses } });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrolled courses', error });
  }
};

exports.getProgressByCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const student = await Student.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const progress = student.progress.find(p => p.courseId === courseId);
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found for this course' });
    }

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Get all modules of enrolled courses for a student
exports.getEnrolledCourseModulesByCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    // Find the student by studentId
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Check if the student is enrolled in the course
    if (!student.enrolledCourses.includes(courseId)) {
      return res.status(403).json({ message: 'Student not enrolled in this course' });
    }

    // Find the course and its modules
    const course = await Course.findOne({ code: courseId }).select('name modules');
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Return course modules
    res.json({
      courseId: course.code,
      courseName: course.name,
      modules: course.modules,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
