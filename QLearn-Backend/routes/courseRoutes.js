const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.get('/code/:code', courseController.getCourseByCode);
router.get('/code/:code/modules', courseController.getModulesByCourseCode);

module.exports = router;
