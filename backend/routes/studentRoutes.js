const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Student = require('../models/student');
const User = require('../models/User');



router.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Optional: GET one student by ID
router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// POST - Add a new student

router.post('/students', async (req, res) => {
  const { name, studentId, department, email } = req.body;

  if (!name || !studentId || !department || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check duplicate student
    // const existingStudent = await Student.findOne({ studentId });
    // if (existingStudent) {
    //   return res.status(409).json({ message: 'Student ID already exists' });
    // }

    // Create Student
    const newStudent = new Student({ name, studentId, department, email });
    await newStudent.save();

    // Create Login (User) - hash password
    const hashedPassword = await bcrypt.hash('Pass@123', 10);

    const newUser = new User({
      username: studentId,
      password: hashedPassword,
      role: 'Student'
    });

    await newUser.save(); // 🔥 make sure this is NOT skipped

    res.status(201).json({ message: 'Student and login created successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
