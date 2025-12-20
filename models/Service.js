const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 5;
      },
      message: 'Maximum 5 images allowed'
    },
    default: []
  },
  shortDesc: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description must be less than 200 characters']
  },
  fullDesc: {
    type: String,
    required: [true, 'Full description is required'],
    trim: true,
    minlength: [100, 'Full description must be at least 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);

