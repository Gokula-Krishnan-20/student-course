const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // <-- add this
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Enable CORS for all origins or restrict to your frontend
app.use(cors());
// Or to restrict only to your Angular app:
// app.use(cors({ origin: 'http://localhost:4200' }));

app.use(express.json());

mongoose.connect('mongodb+srv://harivarshinisr:W0LGfYTndADWxi8g@cluster0.vzc65q1.mongodb.net/student-course?retryWrites=true&w=majority')
  .then(() => console.log('✅ MongoDB connected to student-course DB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// API routes
app.use('/api/students', studentRoutes);
app.use('/api/student/courses', courseRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
