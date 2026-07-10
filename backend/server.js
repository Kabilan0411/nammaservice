require('dotenv').config();
const db = require('./config/db');

console.log("🔍 Active Environment Variables Keys:", Object.keys(process.env).filter(k => !k.toLowerCase().includes('pass') && !k.toLowerCase().includes('secret') && !k.toLowerCase().includes('key')));

async function startServer() {
  // 1. Connect to Database first
  await db.connectDB();

  // 2. Sync Models to auto-create MySQL tables or SQLite tables
  try {
    require('./models');
    await db.sequelize.sync();
    console.log("Database models synchronized and tables verified.");
  } catch (err) {
    console.error("Database synchronization failed:", err);
    process.exit(1);
  }

  // 3. Now require express and local app dependencies after DB is ready
  const express = require('express');
  const cors = require('cors');
  const autoSeed = require('./utils/autoSeed');

  const app = express();

  // Middleware
  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        'https://nammaservice-app.web.app',
        'http://localhost:5173',
        'http://localhost:5174'
      ];
      
      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.endsWith('.vercel.app') || 
                        origin.includes('localhost');
                        
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Routes
  const authRoutes = require('./routes/authRoutes');
  const professionalRoutes = require('./routes/professionalRoutes');
  const serviceRoutes = require('./routes/serviceRoutes');
  const bookingRoutes = require('./routes/bookingRoutes');
  const reviewRoutes = require('./routes/reviewRoutes');
  const notificationRoutes = require('./routes/notificationRoutes');
  const savedProfessionalRoutes = require('./routes/savedProfessionalRoutes');

  // Mount under both '/api' and '/' prefixes to guarantee absolute compatibility
  // with any frontend Axios client baseURL configuration
  app.use('/api/auth', authRoutes);
  app.use('/auth', authRoutes);

  app.post('/api/send-otp', require('./controllers/authController').sendOtp);
  app.post('/api/verify-otp', require('./controllers/authController').verifyOtp);
  app.post('/send-otp', require('./controllers/authController').sendOtp);
  app.post('/verify-otp', require('./controllers/authController').verifyOtp);

  app.use('/api/professionals', professionalRoutes);
  app.use('/professionals', professionalRoutes);

  app.use('/api/services', serviceRoutes);
  app.use('/services', serviceRoutes);

  app.use('/api/bookings', bookingRoutes);
  app.use('/bookings', bookingRoutes);

  app.use('/api/reviews', reviewRoutes);
  app.use('/reviews', reviewRoutes);

  app.use('/api/notifications', notificationRoutes);
  app.use('/notifications', notificationRoutes);

  app.use('/api/saved-professionals', savedProfessionalRoutes);
  app.use('/saved-professionals', savedProfessionalRoutes);

  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'NammaService API is running' });
  });

  // Error Handling Middleware
  app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  });

  // 4. Run auto-seeding if necessary
  await autoSeed();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
