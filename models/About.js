const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  photoUrl: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const journeyStatsSchema = new mongoose.Schema({
  eventsHandled: {
    type: Number,
    default: 0
  },
  vendors: {
    type: Number,
    default: 0
  },
  clients: {
    type: Number,
    default: 0
  }
}, { _id: false });

const aboutSchema = new mongoose.Schema({
  ourStory: {
    type: String,
    default: '',
    trim: true
  },
  ourStoryImage: {
    type: String,
    default: '',
    trim: true
  },
  mission: {
    type: String,
    default: '',
    trim: true
  },
  missionImage: {
    type: String,
    default: '',
    trim: true
  },
  vision: {
    type: String,
    default: '',
    trim: true
  },
  visionImage: {
    type: String,
    default: '',
    trim: true
  },
  values: {
    type: String,
    default: '',
    trim: true
  },
  teamMembers: {
    type: [teamMemberSchema],
    default: []
  },
  journeyStats: {
    type: journeyStatsSchema,
    default: {
      eventsHandled: 0,
      vendors: 0,
      clients: 0
    }
  },
  socialMedia: {
    instagram: { type: String, default: '' },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' }
  }
}, {
  timestamps: true
});

// Ensure only one About document exists
aboutSchema.statics.getSingleton = async function() {
  let about = await this.findOne();
  if (!about) {
    about = await this.create({});
  }
  return about;
};

module.exports = mongoose.model('About', aboutSchema);

