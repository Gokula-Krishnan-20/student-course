const express = require('express');
const router = express.Router();
const Course = require('../models/allCourse');


router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).send(course);
  } catch (err) {
    res.status(400).send(err);
  }
});


router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.send(courses);
});


router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.send(course);
});

router.put('/:id', async (req, res) => {
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updated);
});


router.delete('/:id', async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted successfully' });
});

module.exports = router;

/*

const express = require('express');
const router = express.Router();
const Course = require('../models/allCourse');
const multer = require('multer');
const path = require('path');


// Configure multer storage (save files to 'uploads/' folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // make sure this folder exists
  },
  filename: function (req, file, cb) {
    // Save file with original name + timestamp to avoid overwriting
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Only accept PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Create a course with optional PDF upload
router.post('/', upload.single('material'), async (req, res) => {
  try {
    const courseData = req.body;

    // If file uploaded, save filename in material field
    if (req.file) {
      courseData.material = req.file.filename;
    }

    const course = new Course(courseData);
    await course.save();

    res.status(201).send(course);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.send(courses);
});

// Get course by ID
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.send(course);
});

// Update course with optional PDF upload
router.put('/:id', upload.single('material'), async (req, res) => {
  try {
    const courseData = req.body;

    if (req.file) {
      courseData.material = req.file.filename;
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, courseData, { new: true });
    res.send(updated);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.send({ message: 'Deleted successfully' });
});

// Serve material PDF files
router.get('/material/:filename', (req, res) => {
  const options = {
    root: path.join(__dirname, '../uploads'),
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${req.params.filename}"`,
    },
  };

  res.sendFile(req.params.filename, options, (err) => {
    if (err) res.status(404).send('File not found');
  });
});

module.exports = router;

*/
