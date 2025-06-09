const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Get all courses
router.get('/', courseController.getAllCourses);

// Get course by ID
// router.get('/:id', courseController.getCourseById);

// Get course by course code
router.get('/code/:code', courseController.getCourseByCode);

// Get modules by course ID
// router.get('/:id/modules', courseController.getCourseModules);

// Get modules by course code
router.get('/code/:code/modules', courseController.getCourseModulesByCode);

module.exports = router;
