const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
const uploadDirectory = path.join(__dirname, 'uploads');

// Multer configuration for file uploads
const photosMiddleware = multer({
  dest: uploadDirectory,
  fileFilter: (req, file, cb) => {
    // Validate file types if needed
    // Example: allow only images
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(uploadDirectory));
app.use(cors({
  credentials: true,
  origin: 'http://127.0.0.1:5173', 
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Utility function to get user data from JWT token
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) reject(err);
      resolve(userData);
    });
  });
}

// Routes

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json('test ok');
});

// User registration endpoint
// User registration endpoint
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const userDoc = await User.create({ name, email, password: hashedPassword });

    // Optionally, you can log the successful registration
    console.log(`User registered successfully: ${userDoc}`);

    res.json(userDoc); // Send the user document back as a response
  } catch (e) {
    // Handle registration errors
    console.error('Registration failed:', e.message);

    // Determine the appropriate status code and error message
    let statusCode = 500;
    let errorMessage = 'Registration failed';

    if (e.code === 11000) { // Duplicate key error (MongoDB)
      statusCode = 400;
      errorMessage = 'Email already registered';
    } else if (e.name === 'ValidationError') { // Validation error (Mongoose schema validation)
      statusCode = 422;
      errorMessage = e.message;
    }

    res.status(statusCode).json({ error: errorMessage });
  }
});


// User login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('Incorrect password');
    }
  } else {
    res.status(404).json('User not found');
  }
});

// Profile endpoint
app.get('/api/profile', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { name, email, _id } = await User.findById(userData.id);
    res.json({ name, email, _id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  res.clearCookie('token').json(true);
});

// Upload endpoint using multer for local storage
app.post('/api/upload', photosMiddleware.array('photos', 10), async (req, res) => {
  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    path: file.path,
    url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`, // Example URL to access the file
  }));
  res.json(uploadedFiles);
});

// Places endpoints (example)
app.post('/api/places', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const {
      title, address, photos, description, price,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;

    const placeDoc = await Place.create({
      owner: userData.id,
      title, address, photos, description, price,
      perks, extraInfo, checkIn, checkOut, maxGuests,
    });
    res.json(placeDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Other endpoints (GET /api/user-places, GET /api/places/:id, PUT /api/places, GET /api/places, POST /api/bookings, GET /api/bookings) - Add your implementations here
app.get('/api/user-places', async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/places/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
    }
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/places', async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/bookings', async (req, res) => {
  try {
    const { place, user, checkIn, checkOut, name, phone, price } = req.body;
    const booking = await Booking.create({ place, user, checkIn, checkOut, name, phone, price });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Start server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
