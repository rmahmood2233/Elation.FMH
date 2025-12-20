const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const About = require('../models/About');

connectDB().then(async () => {
  try {
    // Clear existing data
    await Service.deleteMany({});
    await Portfolio.deleteMany({});
    await About.deleteMany({});

    // Seed Services
    const services = await Service.insertMany([
      {
        name: 'Wedding Planning',
        shortDesc: 'Complete wedding coordination from venue selection to the final send-off, ensuring your special day is flawless.',
        fullDesc: 'Our comprehensive wedding planning service covers every aspect of your special day. From initial consultation to the final send-off, we handle venue selection, vendor coordination, timeline management, décor design, catering arrangements, and day-of coordination. We work closely with you to understand your vision and bring it to life with meticulous attention to detail. Our experienced team ensures that every moment is perfectly orchestrated, allowing you to fully enjoy your celebration without worry.',
        price: 350000,
        images: []
      },
      {
        name: 'Corporate Events',
        shortDesc: 'Professional event management for conferences, product launches, and corporate celebrations.',
        fullDesc: 'We specialize in creating impactful corporate events that leave lasting impressions. Our services include conference planning, product launches, team building events, corporate galas, and seminars. We handle all logistics including venue selection, audio-visual setup, catering coordination, guest management, and post-event follow-up. Our team understands the importance of professionalism and brand representation in corporate settings, ensuring your event reflects your company values and objectives.',
        price: 250000,
        images: []
      },
      {
        name: 'Private Parties',
        shortDesc: 'Birthdays, anniversaries, and intimate celebrations designed to create lasting memories.',
        fullDesc: 'From milestone birthdays to intimate anniversaries, we create personalized celebrations that reflect your unique style. Our private party planning service includes theme development, décor design, entertainment booking, catering coordination, and event management. Whether you envision an elegant dinner party or a festive celebration, we work with you to design an event that perfectly captures the spirit of the occasion. Every detail is carefully curated to ensure your guests have an unforgettable experience.',
        price: 150000,
        images: []
      },
      {
        name: 'Engagement Ceremonies',
        shortDesc: 'Beautiful engagement celebrations that mark the beginning of your journey together.',
        fullDesc: 'Celebrate your engagement with a beautifully planned ceremony that sets the tone for your wedding journey. We handle venue selection, décor design, catering, photography, and all event logistics. Our team creates romantic and elegant settings that reflect your love story, ensuring that this special moment is captured perfectly. From intimate gatherings to grand celebrations, we tailor every detail to create an unforgettable engagement experience.',
        price: 200000,
        images: []
      },
      {
        name: 'Anniversary Celebrations',
        shortDesc: 'Honor your journey together with a beautifully planned anniversary celebration.',
        fullDesc: 'Mark your milestones with a celebration that honors your journey together. Our anniversary planning service includes venue selection, theme development, décor design, entertainment, catering, and event coordination. Whether you\'re celebrating one year or fifty years together, we create an event that reflects your unique story and relationship. Every detail is thoughtfully planned to create a memorable celebration that you and your guests will cherish.',
        price: 180000,
        images: []
      }
    ]);

    console.log('✓ Services seeded');

    // Seed Portfolio
    const portfolio = await Portfolio.insertMany([
      {
        eventName: 'Sarah & Michael\'s Wedding',
        location: 'Islamabad',
        timing: 'Evening',
        footCount: 300,
        description: 'An elegant garden wedding with 300 guests featuring custom floral arrangements and luxury catering.',
        images: [],
        dateUploaded: new Date('2024-06-15')
      },
      {
        eventName: 'Tech Summit 2024',
        location: 'Rawalpindi',
        timing: 'Full Day',
        footCount: 500,
        description: 'A professional corporate event with 500 attendees featuring keynote speakers and networking sessions.',
        images: [],
        dateUploaded: new Date('2024-08-20')
      },
      {
        eventName: 'Golden Anniversary',
        location: 'Islamabad',
        timing: 'Evening',
        footCount: 150,
        description: 'A beautiful 50th anniversary celebration with 150 guests featuring elegant décor and live entertainment.',
        images: [],
        dateUploaded: new Date('2024-09-10')
      },
      {
        eventName: 'Aisha\'s Birthday Gala',
        location: 'Rawalpindi',
        timing: 'Evening',
        footCount: 200,
        description: 'A grand birthday celebration with 200 guests featuring themed décor and premium catering.',
        images: [],
        dateUploaded: new Date('2024-10-05')
      },
      {
        eventName: 'Corporate Product Launch',
        location: 'Islamabad',
        timing: 'Evening',
        footCount: 250,
        description: 'A sophisticated product launch event with 250 attendees featuring modern design and interactive displays.',
        images: [],
        dateUploaded: new Date('2024-11-12')
      }
    ]);

    console.log('✓ Portfolio seeded');

    // Seed About
    const about = await About.create({
      ourStory: 'Founded in 2020, Elation by FMH emerged from a passion for creating extraordinary celebrations. What started as a dream to make every event memorable has grown into a trusted name in event planning across Islamabad and Rawalpindi. We believe that every celebration, whether intimate or grand, deserves meticulous attention to detail and a personal touch. Our team of dedicated professionals works tirelessly to transform your vision into reality, ensuring that every moment is perfectly orchestrated.',
      mission: 'To create unforgettable experiences that celebrate life\'s most precious moments. We are committed to delivering exceptional service, innovative design, and seamless execution that exceeds our clients\' expectations.',
      vision: 'To be the most trusted and sought-after event planning company in Pakistan, known for our creativity, professionalism, and ability to turn dreams into reality. We aspire to set new standards in the event planning industry while maintaining our core values of integrity, excellence, and client satisfaction.',
      values: 'Excellence, Integrity, Creativity, Client-Centric Approach, Attention to Detail',
      teamMembers: [
        {
          name: 'Fatima Malik',
          role: 'Founder & Creative Director',
          photoUrl: ''
        },
        {
          name: 'Hassan Ahmed',
          role: 'Event Coordinator',
          photoUrl: ''
        },
        {
          name: 'Ayesha Khan',
          role: 'Design Specialist',
          photoUrl: ''
        }
      ],
      journeyStats: {
        eventsHandled: 200,
        vendors: 50,
        clients: 500
      }
    });

    console.log('✓ About page seeded');

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
});

