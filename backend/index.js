import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import contactRoutes from './routes/contactRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

const allowedOrigins = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'http://127.0.0.1',
  'http://localhost',
  'http://localhost:5000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`), false);
      }
    }
  })
);

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'ShadowTech Backend API is running and connected to DB.' });
});

app.use('/api', contactRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('URI:', process.env.MONGO_URI);
    // Don't exit—let the server run so we can debug
  });

// Start Server
app.listen(PORT, () => {
  console.log(` ShadowTech Backend Server running on http://localhost:${PORT}/`);
});
