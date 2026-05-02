const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Workaround for using ES modules inside commonJS or we can use dynamic import if needed.
// Instead, let's just use commonjs for data.js
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'supersecret_lms_key';

const data = require('./data.js');

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Login Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  
  res.json({ token, user: userWithoutPassword });
});

// Register Route
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (data.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = {
    id: Date.now().toString(),
    name, email, password, role: 'student', enrolledCourses: [], progress: []
  };
  data.users.push(newUser);
  const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });
  const userWithoutPassword = { ...newUser };
  delete userWithoutPassword.password;
  res.json({ token, user: userWithoutPassword });
});

// Get Courses
app.get('/api/courses', (req, res) => {
  const search = req.query.search?.toLowerCase();
  let result = data.courses;
  if (search) {
    result = result.filter(c => c.title.toLowerCase().includes(search) || c.category.toLowerCase().includes(search));
  }
  res.json(result);
});

// Get Course by ID
app.get('/api/courses/:id', (req, res) => {
  const course = data.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

// Enroll in course
app.post('/api/courses/:id/enroll', authMiddleware, (req, res) => {
  const user = data.users.find(u => u.id === req.user.id);
  const courseId = req.params.id;
  if (!user.enrolledCourses.includes(courseId)) {
    user.enrolledCourses.push(courseId);
    user.progress.push({ courseId, completedModules: [], progressPercentage: 0 });
  }
  res.json({ message: 'Enrolled successfully', enrolledCourses: user.enrolledCourses });
});

// Update Progress
app.put('/api/progress/:courseId', authMiddleware, (req, res) => {
  const user = data.users.find(u => u.id === req.user.id);
  const courseId = req.params.courseId;
  const { moduleId } = req.body;
  
  const course = data.courses.find(c => c.id === courseId);
  const progress = user.progress.find(p => p.courseId === courseId);
  
  if (progress && !progress.completedModules.includes(moduleId)) {
    progress.completedModules.push(moduleId);
    progress.progressPercentage = Math.round((progress.completedModules.length / course.modules.length) * 100);
  }
  
  res.json(progress);
});

// Admin: Create Course
app.post('/api/courses', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const newCourse = { id: Date.now().toString(), ...req.body, modules: req.body.modules || [] };
  data.courses.push(newCourse);
  res.json(newCourse);
});

// Get User Dashboard (Enrolled courses)
app.get('/api/user/dashboard', authMiddleware, (req, res) => {
  const user = data.users.find(u => u.id === req.user.id);
  const enrolledCoursesDetails = user.enrolledCourses.map(courseId => {
    const course = data.courses.find(c => c.id === courseId);
    const progress = user.progress.find(p => p.courseId === courseId);
    return { ...course, progress: progress?.progressPercentage || 0, completedModules: progress?.completedModules || [] };
  });
  
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  res.json({ user: userWithoutPassword, enrolledCourses: enrolledCoursesDetails });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
