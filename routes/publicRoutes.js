const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const About = require('../models/About');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');

// Home page
router.get('/', async (req, res) => {
  try {
    const recentPortfolio = await Portfolio.find()
      .sort({ dateUploaded: -1 })
      .limit(4)
      .lean();
    
    const featuredServices = await Service.find()
      .limit(3)
      .lean();
    
    const allServices = await Service.find().lean();

    res.render('home', {
      title: 'Home - Elation by FMH',
      recentPortfolio,
      featuredServices,
      services: allServices
    });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).render('error', { message: 'Error loading page', error: {} });
  }
});

// Services page
router.get('/services', async (req, res) => {
  try {
    const Service = require('../models/Service');
    const Package = require('../models/Package');
    const services = await Service.find().sort({ createdAt: -1 }).lean();
    const packages = await Package.find().sort({ name: 1 }).lean();
    res.render('services', {
      title: 'Services - Elation by FMH',
      services,
      packages
    });
  } catch (error) {
    console.error('Error loading services:', error);
    res.status(500).render('error', { message: 'Error loading services', error: {} });
  }
});

// Portfolio page
router.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.find().sort({ dateUploaded: -1 }).lean();
    const about = await About.getSingleton();
    res.render('portfolio', {
      title: 'Portfolio - Elation by FMH',
      portfolio,
      about
    });
  } catch (error) {
    console.error('Error loading portfolio:', error);
    res.status(500).render('error', { message: 'Error loading portfolio', error: {} });
  }
});

// About page
router.get('/about', async (req, res) => {
  try {
    const about = await About.getSingleton();
    res.render('about', {
      title: 'About Us - Elation by FMH',
      about
    });
  } catch (error) {
    console.error('Error loading about page:', error);
    res.status(500).render('error', { message: 'Error loading page', error: {} });
  }
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Elation by FMH'
  });
});

// Handle contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message } = req.body;
    
    const contact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      subject,
      message
    });

    await contact.save();
    res.json({ success: true, message: 'Thank you! Your message has been sent successfully.' });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ success: false, message: 'Error sending message. Please try again.' });
  }
});

// Handle booking form submission
router.post('/booking', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      eventType,
      date,
      location,
      guestCount,
      serviceId,
      packageType,
      message
    } = req.body;

    const booking = new Booking({
      firstName,
      lastName,
      email,
      phone,
      eventType,
      date,
      location,
      guestCount,
      serviceId: serviceId || null,
      packageType,
      message
    });

    await booking.save();
    res.json({ success: true, message: 'Booking request submitted successfully! We will contact you soon.' });
  } catch (error) {
    console.error('Error submitting booking:', error);
    res.status(500).json({ success: false, message: 'Error submitting booking. Please try again.' });
  }
});

module.exports = router;

