const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const About = require('../models/About');
const User = require('../models/User');

// Middleware to check admin authentication
const isAdmin = (req, res, next) => {
  if (!req.session.isAdmin) {
    return res.redirect('/auth/login');
  }
  next();
};

// Apply admin middleware to all routes
router.use(isAdmin);

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const stats = {
      totalBookings: await Booking.countDocuments(),
      newBookings: await Booking.countDocuments({ status: 'New' }),
      totalMessages: await Contact.countDocuments(),
      newMessages: await Contact.countDocuments({ status: 'New' }),
      totalServices: await Service.countDocuments(),
      totalPortfolio: await Portfolio.countDocuments()
    };

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const recentMessages = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.render('admin/dashboard', {
      title: 'Admin Dashboard - Elation by FMH',
      stats,
      recentBookings,
      recentMessages
    });
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    res.status(500).render('error', { message: 'Error loading dashboard', error: {} });
  }
});

// Services Management
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }).lean();
    res.render('admin/services', {
      title: 'Manage Services - Elation by FMH',
      services
    });
  } catch (error) {
    console.error('Error loading services:', error);
    res.status(500).render('error', { message: 'Error loading services', error: {} });
  }
});

router.post('/services', async (req, res) => {
  try {
    const upload = require('../config/upload');
    const uploadMultiple = upload.array('images', 5);
    
    uploadMultiple(req, res, async (err) => {
      // Handle multer errors but allow requests without files
      if (err) {
        // Only reject actual file errors
        if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT' || (err.message && err.message.includes('Only image files'))) {
          return res.status(400).json({ success: false, message: err.message });
        }
        // For missing files or unexpected file errors, continue without files
      }
      
      const { name, shortDesc, fullDesc, price, imageUrls } = req.body;
      
      // Validate required fields
      if (!name || !shortDesc || !fullDesc || !price) {
        return res.status(400).json({ success: false, message: 'All required fields must be filled' });
      }
      
      // Combine uploaded files and URLs
      let images = [];
      if (req.files && req.files.length > 0) {
        images = req.files.map(file => '/uploads/' + file.filename);
      }
      
      // Add URL images if provided
      if (imageUrls && imageUrls.trim()) {
        const urlImages = imageUrls.split('\n').map(url => url.trim()).filter(url => url && url.startsWith('http'));
        images = [...images, ...urlImages].slice(0, 5); // Max 5 images
      }
      
      const service = new Service({
        name: name.trim(),
        shortDesc: shortDesc.trim(),
        fullDesc: fullDesc.trim(),
        price: parseFloat(price),
        images
      });

      try {
        await service.save();
        res.json({ success: true, message: 'Service created successfully', service });
      } catch (saveError) {
        console.error('Error saving service:', saveError);
        let errorMessage = 'Error creating service';
        if (saveError.errors) {
          errorMessage = Object.values(saveError.errors).map(e => e.message).join(', ');
        } else if (saveError.message) {
          errorMessage = saveError.message;
        }
        res.status(400).json({ success: false, message: errorMessage });
      }
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ success: false, message: 'Error creating service' });
  }
});

router.get('/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).lean();
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ success: false, message: 'Error fetching service' });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const upload = require('../config/upload');
    const uploadMultiple = upload.array('images', 5);
    
    uploadMultiple(req, res, async (err) => {
      // Handle multer errors but allow requests without files
      if (err) {
        // Only reject actual file errors
        if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT' || (err.message && err.message.includes('Only image files'))) {
          return res.status(400).json({ success: false, message: err.message });
        }
        // For missing files or unexpected file errors, continue without files
      }
      
      const { name, shortDesc, fullDesc, price, imageUrls } = req.body;
      
      // Validate required fields
      if (!name || !shortDesc || !fullDesc || !price) {
        return res.status(400).json({ success: false, message: 'All required fields must be filled' });
      }
      
      // Start with empty array, then add URLs if provided, then add new uploads
      let images = [];
      
      // Add URL images if provided
      if (imageUrls && imageUrls.trim()) {
        const urlImages = imageUrls.split('\n').map(url => url.trim()).filter(url => url && url.startsWith('http'));
        images = [...urlImages];
      }
      
      // Add new uploaded files
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => '/uploads/' + file.filename);
        images = [...images, ...newImages].slice(0, 5);
      }
      
      // Get existing images if no new images provided
      if (images.length === 0) {
        const existing = await Service.findById(req.params.id);
        if (existing) images = existing.images;
      }
      
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        {
          name: name.trim(),
          shortDesc: shortDesc.trim(),
          fullDesc: fullDesc.trim(),
          price: parseFloat(price),
          images
        },
        { new: true }
      );

      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found' });
      }

      res.json({ success: true, message: 'Service updated successfully', service });
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ success: false, message: 'Error updating service' });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ success: false, message: 'Error deleting service' });
  }
});

// Portfolio Management
router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.find().sort({ dateUploaded: -1 }).lean();
    res.render('admin/portfolio', {
      title: 'Manage Portfolio - Elation by FMH',
      currentPage: 'portfolio',
      portfolio
    });
  } catch (error) {
    console.error('Error loading portfolio:', error);
    res.status(500).render('error', { message: 'Error loading portfolio', error: {} });
  }
});

router.post('/portfolio', async (req, res) => {
  try {
    const upload = require('../config/upload');
    const uploadMultiple = upload.array('images', 10);
    
    uploadMultiple(req, res, async (err) => {
      // Handle multer errors but allow requests without files
      if (err) {
        // Only reject actual file errors
        if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT' || (err.message && err.message.includes('Only image files'))) {
          return res.status(400).json({ success: false, message: err.message });
        }
        // For missing files or unexpected file errors, continue without files
      }
      
      const { eventName, location, timing, footCount, description, imageUrls } = req.body;
      
      // Validate required fields
      if (!eventName || !location) {
        return res.status(400).json({ success: false, message: 'Event Name and Location are required' });
      }
      
      // Combine uploaded files and URLs
      let images = [];
      if (req.files && req.files.length > 0) {
        images = req.files.map(file => '/uploads/' + file.filename);
      }
      
      // Add URL images if provided
      if (imageUrls && imageUrls.trim()) {
        const urlImages = imageUrls.split('\n').map(url => url.trim()).filter(url => url && url.startsWith('http'));
        images = [...images, ...urlImages].slice(0, 10); // Max 10 images
      }
      
      const portfolio = new Portfolio({
        eventName,
        location,
        timing,
        footCount: footCount ? parseInt(footCount) : 0,
        description,
        images
      });

      try {
        await portfolio.save();
        res.json({ success: true, message: 'Portfolio item created successfully', portfolio });
      } catch (saveError) {
        console.error('Error saving portfolio:', saveError);
        let errorMessage = 'Error creating portfolio item';
        if (saveError.errors) {
          errorMessage = Object.values(saveError.errors).map(e => e.message).join(', ');
        } else if (saveError.message) {
          errorMessage = saveError.message;
        }
        res.status(400).json({ success: false, message: errorMessage });
      }
    });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    res.status(500).json({ success: false, message: 'Error creating portfolio item' });
  }
});

router.get('/portfolio/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id).lean();
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    res.json({ success: true, portfolio });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ success: false, message: 'Error fetching portfolio item' });
  }
});

router.put('/portfolio/:id', async (req, res) => {
  try {
    const upload = require('../config/upload');
    const uploadMultiple = upload.array('images', 10);
    
    uploadMultiple(req, res, async (err) => {
      // Handle multer errors but allow requests without files
      if (err) {
        // Only reject actual file errors
        if (err.code === 'LIMIT_FILE_SIZE' || err.code === 'LIMIT_FILE_COUNT' || (err.message && err.message.includes('Only image files'))) {
          return res.status(400).json({ success: false, message: err.message });
        }
        // For missing files or unexpected file errors, continue without files
      }
      
      const { eventName, location, timing, footCount, description, imageUrls } = req.body;
      
      // Validate required fields
      if (!eventName || !location) {
        return res.status(400).json({ success: false, message: 'Event Name and Location are required' });
      }
      
      // Get existing portfolio to preserve existing images
      const existingPortfolio = await Portfolio.findById(req.params.id);
      let images = existingPortfolio ? existingPortfolio.images : [];
      
      // Add new uploaded files
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => '/uploads/' + file.filename);
        images = [...images, ...newImages].slice(0, 10);
      }
      
      // Add URL images if provided
      if (imageUrls && imageUrls.trim()) {
        const urlImages = imageUrls.split('\n').map(url => url.trim()).filter(url => url && url.startsWith('http'));
        images = [...images, ...urlImages].slice(0, 10);
      }
      
      // Get existing images if no new images provided
      if (images.length === 0) {
        const existing = await Portfolio.findById(req.params.id);
        if (existing) images = existing.images;
      }
      
      const portfolio = await Portfolio.findByIdAndUpdate(
        req.params.id,
        {
          eventName: eventName.trim(),
          location: location.trim(),
          timing: timing ? timing.trim() : undefined,
          footCount: footCount ? parseInt(footCount) : 0,
          description: description ? description.trim() : undefined,
          images
        },
        { new: true }
      );

      if (!portfolio) {
        return res.status(404).json({ success: false, message: 'Portfolio item not found' });
      }

      res.json({ success: true, message: 'Portfolio item updated successfully', portfolio });
    });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    res.status(500).json({ success: false, message: 'Error updating portfolio item' });
  }
});

router.delete('/portfolio/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }
    res.json({ success: true, message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    res.status(500).json({ success: false, message: 'Error deleting portfolio item' });
  }
});

// Bookings Management
router.get('/bookings', async (req, res) => {
  try {
    const { eventType, status, search } = req.query;
    
    let query = {};
    if (eventType) query.eventType = eventType;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(query)
      .sort({ date: -1 })
      .populate('serviceId', 'name')
      .lean();

    res.render('admin/bookings', {
      title: 'Manage Bookings - Elation by FMH',
      currentPage: 'bookings',
      bookings,
      filters: { eventType, status, search }
    });
  } catch (error) {
    console.error('Error loading bookings:', error);
    res.status(500).render('error', { message: 'Error loading bookings', error: {} });
  }
});

router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('serviceId', 'name')
      .lean();

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ success: false, message: 'Error fetching booking' });
  }
});

router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ success: false, message: 'Error updating booking status' });
  }
});

// Messages Management
router.get('/messages', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.render('admin/messages', {
      title: 'Manage Messages - Elation by FMH',
      currentPage: 'messages',
      messages,
      filters: { status, search }
    });
  } catch (error) {
    console.error('Error loading messages:', error);
    res.status(500).render('error', { message: 'Error loading messages', error: {} });
  }
});

router.get('/messages/:id', async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id).lean();
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.json({ success: true, message });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ success: false, message: 'Error fetching message' });
  }
});

router.put('/messages/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Message status updated', message });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ success: false, message: 'Error updating message status' });
  }
});

// About Us Management
router.get('/about', async (req, res) => {
  try {
    const about = await About.getSingleton();
    res.render('admin/about', {
      title: 'Manage About Us - Elation by FMH',
      about
    });
  } catch (error) {
    console.error('Error loading about page:', error);
    res.status(500).render('error', { message: 'Error loading page', error: {} });
  }
});

router.post('/about', async (req, res) => {
  try {
    const { ourStory, ourStoryImage, mission, missionImage, vision, visionImage, values, teamMembers, journeyStats, socialMedia } = req.body;
    
    let about = await About.findOne();
    if (!about) {
      about = new About();
    }

    about.ourStory = ourStory || about.ourStory;
    about.ourStoryImage = ourStoryImage || about.ourStoryImage;
    about.mission = mission || about.mission;
    about.missionImage = missionImage || about.missionImage;
    about.vision = vision || about.vision;
    about.visionImage = visionImage || about.visionImage;
    about.values = values || about.values;
    
    if (teamMembers) {
      about.teamMembers = Array.isArray(teamMembers) ? teamMembers : JSON.parse(teamMembers);
    }
    
    if (journeyStats) {
      about.journeyStats = typeof journeyStats === 'string' ? JSON.parse(journeyStats) : journeyStats;
    }
    
    if (socialMedia) {
      about.socialMedia = typeof socialMedia === 'string' ? JSON.parse(socialMedia) : socialMedia;
    }

    await about.save();
    res.json({ success: true, message: 'About page updated successfully', about });
  } catch (error) {
    console.error('Error updating about page:', error);
    res.status(500).json({ success: false, message: 'Error updating about page' });
  }
});

// Team Photo Upload
router.post('/upload-team-photo', async (req, res) => {
  try {
    const upload = require('../config/upload');
    const uploadSingle = upload.single('photo');
    
    uploadSingle(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }
      
      res.json({ success: true, url: '/uploads/' + req.file.filename });
    });
  } catch (error) {
    console.error('Error uploading team photo:', error);
    res.status(500).json({ success: false, message: 'Error uploading photo' });
  }
});

// Packages Management
router.get('/packages', async (req, res) => {
  try {
    const Package = require('../models/Package');
    const packages = await Package.find().sort({ name: 1 }).lean();
    res.render('admin/packages', {
      title: 'Manage Packages - Elation by FMH',
      currentPage: 'packages',
      packages
    });
  } catch (error) {
    console.error('Error loading packages:', error);
    res.status(500).render('error', { message: 'Error loading packages', error: {} });
  }
});

router.get('/packages/:id', async (req, res) => {
  try {
    const Package = require('../models/Package');
    const packageDoc = await Package.findById(req.params.id).lean();
    if (!packageDoc) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, package: packageDoc });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ success: false, message: 'Error fetching package' });
  }
});

router.post('/packages', async (req, res) => {
  try {
    const Package = require('../models/Package');
    const { name, displayName, price, features, isFeatured } = req.body;
    
    let packageDoc = await Package.findOne({ name });
    if (!packageDoc) {
      packageDoc = new Package({ name });
    }
    
    packageDoc.displayName = displayName;
    packageDoc.price = price;
    packageDoc.features = Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()).filter(f => f) : []);
    packageDoc.isFeatured = isFeatured === true || isFeatured === 'true';
    
    await packageDoc.save();
    res.json({ success: true, message: 'Package saved successfully', package: packageDoc });
  } catch (error) {
    console.error('Error saving package:', error);
    const errorMessage = error.errors ? Object.values(error.errors).map(e => e.message).join(', ') : 'Error saving package';
    res.status(500).json({ success: false, message: errorMessage });
  }
});

// Users Management
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.render('admin/users', {
      title: 'Manage Users - Elation by FMH',
      users
    });
  } catch (error) {
    console.error('Error loading users:', error);
    res.status(500).render('error', { message: 'Error loading users', error: {} });
  }
});

module.exports = router;

