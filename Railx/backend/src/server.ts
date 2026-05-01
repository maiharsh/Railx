import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import './models/Passenger';
import './models/Train';
import './models/Station';
import './models/Schedule';
import './models/Booking';
import './models/Seat';
import './models/UserSession';
import './models/Admin';
import './models/Payment';
import './models/Cancellation';
import './models/Notification';

import { connectDB } from './lib/db';


import authRoutes from './routes/auth';
import stationsRoutes from './routes/stations';
import trainsRoutes from './routes/trains';
import schedulesRoutes from './routes/schedules';
import bookingsRoutes from './routes/bookings';
import adminAuthRoutes from './routes/admin-auth';
import adminRoutes from './routes/admin';
import paymentsRoutes from './routes/payments';
import cancellationsRoutes from './routes/cancellations';
import notificationsRoutes from './routes/notifications';
import profileRoutes from './routes/profile';
import qrRoutes from './routes/qr';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());


async function startServer() {
  try {
    await connectDB();
    
    
    app.use('/api/auth', authRoutes);
    app.use('/api/admin-auth', adminAuthRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/stations', stationsRoutes);
    app.use('/api/trains', trainsRoutes);
    app.use('/api/schedules', schedulesRoutes);
    app.use('/api/bookings', bookingsRoutes);
    app.use('/api/payments', paymentsRoutes);
    app.use('/api/cancellations', cancellationsRoutes);
    app.use('/api/notifications', notificationsRoutes);
    app.use('/api/profile', profileRoutes);
    app.use('/api/qr', qrRoutes);

    
    app.get('/health', (req: Request, res: Response) => {
      res.json({ message: 'Backend server is running' });
    });

    
    app.use((err: any, req: Request, res: Response, next: any) => {
      console.error('Error:', err);
      res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();