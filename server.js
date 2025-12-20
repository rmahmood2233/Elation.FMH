const express = require('express');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'elation-fmh-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make user session and about data available to all views
app.use(async (req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.isAdmin || false;
  
  // If user is logged in, fetch full user data for navbar
  if (req.session.user && req.session.user.id) {
    try {
      const User = require('./models/User');
      const user = await User.findById(req.session.user.id).lean();
      if (user) {
        res.locals.user = {
          ...req.session.user,
          profilePic: user.profilePic,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          location: user.location,
          profession: user.profession
        };
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
  
  // Load About data for footer social links
  try {
    const About = require('./models/About');
    const about = await About.getSingleton();
    res.locals.about = about;
  } catch (error) {
    res.locals.about = null;
  }
  
  next();
});

// Routes
app.use('/', require('./routes/publicRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Page not found',
    error: {}
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

