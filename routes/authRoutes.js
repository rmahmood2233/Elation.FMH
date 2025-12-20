const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', {
    title: 'Login - Elation by FMH'
  });
});

// Signup page
router.get('/signup', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('signup', {
    title: 'Sign Up - Elation by FMH'
  });
});

// Handle login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded admin check
    if (email === 'adminFMH@gmail.com' && password === 'FMHadmin666') {
      req.session.isAdmin = true;
      req.session.user = {
        email: 'adminFMH@gmail.com',
        isAdmin: true
      };
      return res.json({ success: true, redirect: '/admin/dashboard' });
    }

    // Regular user login
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin
    };
    req.session.isAdmin = user.isAdmin;

    res.json({ 
      success: true, 
      redirect: user.isAdmin ? '/admin/dashboard' : '/' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Handle signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName: firstName || '',
      lastName: lastName || ''
    });

    await user.save();

    // Auto login after signup
    req.session.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin
    };
    req.session.isAdmin = false;

    res.json({ success: true, redirect: '/' });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.json({ success: false, message: 'Error logging out' });
    }
    res.json({ success: true, redirect: '/' });
  });
});

// Get current user profile (JSON for AJAX)
router.get('/profile', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(req.session.user.id).lean();
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error loading profile:', error);
    res.status(500).json({ success: false, message: 'Error loading profile' });
  }
});

// Update user profile info (name, phone, location, profession)
router.post('/profile/update', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const { firstName, lastName, phoneNumber, location, profession } = req.body;
    
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const user = await User.findById(req.session.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields - firstName is required, so always update it if provided and not empty
    if (firstName !== undefined && firstName !== null && firstName.trim()) {
      user.firstName = firstName.trim();
    } else if (firstName !== undefined && (!firstName || !firstName.trim())) {
      // If firstName is provided but empty, don't update (keep existing)
      // firstName is required, so we can't set it to empty
    }
    
    if (lastName !== undefined && lastName !== null) {
      user.lastName = lastName.trim() || '';
    }
    if (phoneNumber !== undefined && phoneNumber !== null) {
      user.phoneNumber = phoneNumber.trim() || '';
    }
    if (location !== undefined && location !== null) {
      user.location = location.trim() || '';
    }
    if (profession !== undefined && profession !== null) {
      user.profession = profession.trim() || '';
    }

    await user.save();

    // Update session
    req.session.user.firstName = user.firstName;
    req.session.user.lastName = user.lastName;

    res.json({ success: true, message: 'Profile updated successfully', user: {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      location: user.location,
      profession: user.profession
    }});
  } catch (error) {
    console.error('Error updating profile:', error);
    let errorMessage = 'Error updating profile';
    if (error.errors) {
      errorMessage = Object.values(error.errors).map(e => e.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    res.status(500).json({ success: false, message: errorMessage });
  }
});

// Update profile picture
router.post('/profile/picture', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const upload = require('../config/upload');
    const uploadSingle = upload.single('profilePic');
    
    uploadSingle(req, res, async (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ success: false, message: err.message || 'File upload error' });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.profilePic = '/uploads/' + req.file.filename;
        await user.save();

        res.json({ success: true, message: 'Profile picture updated successfully', profilePic: user.profilePic });
      } catch (saveError) {
        console.error('Error saving profile picture:', saveError);
        let errorMessage = 'Error updating profile picture';
        if (saveError.errors) {
          errorMessage = Object.values(saveError.errors).map(e => e.message).join(', ');
        } else if (saveError.message) {
          errorMessage = saveError.message;
        }
        res.status(500).json({ success: false, message: errorMessage });
      }
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ success: false, message: error.message || 'Error updating profile picture' });
  }
});

module.exports = router;

