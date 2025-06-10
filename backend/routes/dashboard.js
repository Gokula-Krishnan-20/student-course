/* const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');

// GET /api/dashboard/metrics
router.get('/metrics', async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalInstructors = await User.countDocuments({ role: 'Instructor' });
    const totalStudents = await User.countDocuments({ role: 'Student' });
    const approvedCourses = await Course.countDocuments({ approved: true });

    const highRatedCourses = await Course.find({ rating: { $gte: 4.5 } })
      .select('title rating')
      .limit(5);

    const coursesPerInstructor = await Course.aggregate([
      {
        $group: {
          _id: "$instructorId",
          totalCourses: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "instructor"
        }
      },
      {
        $unwind: "$instructor"
      },
      {
        $project: {
          instructorName: "$instructor.name",
          totalCourses: 1
        }
      }
    ]);

    const courseCompletion = await Course.aggregate([
      {
        $project: {
          title: 1,
          totalStudents: { $size: "$studentsEnrolled" },
          completed: { $size: "$completedStudents" }
        }
      }
    ]);

    res.json({
      totalCourses,
      totalInstructors,
      totalStudents,
      approvedCourses,
      highRatedCourses,
      coursesPerInstructor,
      courseCompletion
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
});

module.exports = router;
 */


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // ✅ Make sure the filename matches (User.js)

// ✅ Register user (Admin or Student)
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or role' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all users (optional)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
});

module.exports = router;
