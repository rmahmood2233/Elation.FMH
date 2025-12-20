const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: 'Maximum 10 images allowed'
    },
    default: []
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  timing: {
    type: String,
    trim: true
  },
  footCount: {
    type: Number,
    min: [0, 'Foot count must be positive']
  },
  description: {
    type: String,
    trim: true
  },
  dateUploaded: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);

