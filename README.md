# Elation by FMH - Event Planning Web Application

A full-stack Node.js/Express web application for event planning services, built with MongoDB, EJS templating, and a beautiful pink/wedding theme.

## Features

- **User Authentication**: Login/Signup with session management
- **Admin Dashboard**: Complete CRUD operations for services, portfolio, bookings, and messages
- **Dynamic Content**: All content is database-driven
- **Booking System**: Global booking modal available on all pages
- **Contact Form**: Integrated contact form with message management
- **Responsive Design**: Mobile-friendly with modern UI

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Templating**: EJS
- **Authentication**: Express-session, bcryptjs
- **Styling**: Custom CSS with Pink/Wedding theme

## Installation

### Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
  - OR use **MongoDB Atlas** (cloud database) - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

### Setup Instructions

#### If You Received This Project as a ZIP File:

1. **Extract the ZIP file** to a folder on your computer

2. **Open terminal/command prompt** and navigate to the project folder:
```bash
cd path/to/prototype
```

3. **Install dependencies**:
```bash
npm install
```
This will install all required packages listed in `package.json`.

4. **Set up environment variables**:
Create a `.env` file in the root directory (same folder as `server.js`):
```
MONGODB_URI=mongodb://localhost:27017/elation-fmh
SESSION_SECRET=your-secret-key-here-make-it-random
PORT=3000
NODE_ENV=development
```

**Note:** 
- If using **MongoDB Atlas** (cloud), replace `MONGODB_URI` with your Atlas connection string
- Generate a random `SESSION_SECRET` (you can use: `openssl rand -base64 32` or any random string)

5. **Start MongoDB**:

**Option A: Local MongoDB**
```bash
# Windows (Run as Administrator)
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Recommended for beginners)**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster (M0 tier)
- Create database user and whitelist your IP (0.0.0.0/0 for development)
- Get connection string and update `MONGODB_URI` in `.env`

6. **Seed the database** (optional but recommended for initial data):
```bash
npm run seed
```

7. **Start the server**:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

8. **Access the application**:
- Open your browser and go to: **http://localhost:3000**
- Admin login: 
  - Email: `adminFMH@gmail.com`
  - Password: `FMHadmin666`

### Troubleshooting Setup

**Error: "Cannot find module 'xyz'"**
- Run `npm install` again to ensure all dependencies are installed

**Error: "MongoDB connection failed"**
- Check if MongoDB is running (local) or connection string is correct (Atlas)
- Verify your `.env` file exists and has correct `MONGODB_URI`

**Error: "Port 3000 already in use"**
- Change `PORT=3001` in `.env` file
- Or stop the process using port 3000

**Windows: "net start MongoDB" doesn't work**
- Make sure MongoDB is installed as a Windows service
- Or start MongoDB manually from installation directory
- Consider using MongoDB Atlas instead

### File Structure After Setup

After running `npm install`, your project should have:
```
prototype/
├── node_modules/          # Created after npm install
├── .env                   # You need to create this
├── package.json
├── server.js
├── config/
├── models/
├── routes/
├── views/
├── public/
└── ...
```

## Project Structure

```
prototype/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User model
│   ├── Booking.js           # Booking model
│   ├── Service.js           # Service model
│   ├── Portfolio.js         # Portfolio model
│   ├── About.js             # About model
│   └── Contact.js           # Contact model
├── routes/
│   ├── publicRoutes.js      # Public routes (home, services, etc.)
│   ├── authRoutes.js        # Authentication routes
│   └── adminRoutes.js       # Admin dashboard routes
├── views/
│   ├── partials/            # Reusable EJS partials
│   ├── admin/               # Admin dashboard views
│   ├── home.ejs
│   ├── services.ejs
│   ├── portfolio.ejs
│   ├── about.ejs
│   ├── contact.ejs
│   ├── login.ejs
│   └── signup.ejs
├── public/
│   ├── css/
│   │   └── styles.css       # Main stylesheet (Pink theme)
│   └── js/
│       └── script.js        # Client-side JavaScript
├── scripts/
│   └── seed.js              # Database seeding script
├── server.js                # Main server file
└── package.json
```

## Database Models

### User
- firstName, lastName, email, password (hashed), profilePic, phoneNumber, location, profession, isAdmin

### Booking
- firstName, lastName, email, phone, eventType, date, location, guestCount, serviceId, packageType, message, status

### Service
- name, images (max 5), shortDesc, fullDesc (100+ words), price

### Portfolio
- eventName, images (max 10), location, timing, footCount, description, dateUploaded

### About
- ourStory, mission, vision, values, teamMembers[], journeyStats{}

### Contact
- firstName, lastName, email, phone, subject, message, status

## Admin Features

- **Dashboard**: Overview with statistics and recent bookings/messages
- **Services Management**: Add, edit, delete services
- **Portfolio Management**: Add, edit, delete portfolio items
- **Bookings Management**: View, filter, search, and update booking status
- **Messages Management**: View, filter, search, and mark messages as read/unread
- **About Us Management**: Update company information, team members, and stats
- **Users Management**: View all registered users

## Color Theme

The application uses a Pink/Wedding theme:
- **Primary**: Dusty Pink/Rose Gold (#E3BFB9)
- **Secondary**: Soft Blush (#FADADD)
- **Accent/Buttons**: Deep Wine/Red (#B3545E)
- **Backgrounds**: Warm White/Cream (#FFF8F5)

## API Endpoints

### Public Routes
- `GET /` - Home page
- `GET /services` - Services page
- `GET /portfolio` - Portfolio page
- `GET /about` - About page
- `GET /contact` - Contact page
- `POST /contact` - Submit contact form
- `POST /booking` - Submit booking form

### Auth Routes
- `GET /auth/login` - Login page
- `GET /auth/signup` - Signup page
- `POST /auth/login` - Handle login
- `POST /auth/signup` - Handle signup
- `POST /auth/logout` - Handle logout
- `GET /auth/profile` - User profile page
- `POST /auth/profile` - Update user profile

### Admin Routes (Requires admin authentication)
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/services` - Manage services
- `POST /admin/services` - Create service
- `PUT /admin/services/:id` - Update service
- `DELETE /admin/services/:id` - Delete service
- Similar routes for portfolio, bookings, messages, about, and users

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for automatic server restarts on file changes.

### Database Seeding
To populate the database with sample data:
```bash
npm run seed
```

## Notes

- Admin credentials are hardcoded: `adminFMH@gmail.com` / `FMHadmin666`
- All passwords are hashed using bcryptjs
- Sessions are stored server-side using express-session
- Image uploads are prepared for multer (implementation can be added)

## License

ISC

## Author

Elation by FMH

