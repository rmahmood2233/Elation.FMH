const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['Wedding', 'Engagement', 'Birthday', 'Corporate', 'Anniversary', 'Other']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    enum: ['Islamabad', 'Rawalpindi']
  },
  guestCount: {
    type: Number,
    required: [true, 'Guest count is required'],
    min: [1, 'Guest count must be at least 1']
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  },
  packageType: {
    type: String,
    required: [true, 'Package type is required'],
    enum: ['basic', 'premium', 'luxury', 'custom']
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'Read', 'Confirmed'],
    default: 'New'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

