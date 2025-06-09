const express = require('express');
const router = express.Router();
const studentCtrl = require('../controllers/studentController');

// Get all students
router.get('/', studentCtrl.getAllStudents);

// Get student by ID
router.get('/:studentId', studentCtrl.getStudentById);

// Get full course details of enrolled courses
router.get('/:studentId/enrolled-courses', studentCtrl.getEnrolledCourses);

// Get progress with course details
router.get('/:studentId/progress/:courseId', studentCtrl.getProgress);

// Update course progress
router.put('/:studentId/progress', studentCtrl.updateProgress);

// Enroll student in a course
router.put('/:studentId/enroll', studentCtrl.enrollCourse);

// Update student profile
router.put('/:studentId', studentCtrl.updateStudentDetails);

// Mark module as completed in a course
router.patch('/:studentId/courses/:courseId/modules/:moduleId/completion', 
  studentCtrl.updateModuleCompletion);
  // DELETE /api/students/:studentId/enroll/:courseId
router.delete('/:studentId/enroll/:courseId', studentCtrl.unenrollCourse);
router.get('/:studentId/enrolled-courses/details',studentCtrl.getEnrolledCourseDetails);
router.get('/:studentId/progress/:courseId', studentCtrl.getProgressByCourse);
// GET /api/student/:studentId/enrolled-courses/:courseId/modules
router.get('/:studentId/enrolled-courses/:courseId/modules', studentCtrl.getEnrolledCourseModulesByCourse);




module.exports = router;
