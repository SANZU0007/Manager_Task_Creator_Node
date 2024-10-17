import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import goalRoutes from './routes/goalRoutes.js';
import userRoutes from "./routes/userRoutes.js"

import attendanceRoutes from './routes/attendanceRoutes.js';


dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/goals', goalRoutes);
app.use('/api/users',userRoutes  );  // User routes





app.use('/api/attendance', attendanceRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
