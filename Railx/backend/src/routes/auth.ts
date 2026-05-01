import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import Passenger from '../models/Passenger';
import UserSession from '../models/UserSession';
import { signToken } from '../lib/jwt';
import { AuthRequest } from '../middleware/auth';

const router = Router();


router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await Passenger.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken({ passengerId: user._id, email: user.email });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await UserSession.create({
      passenger_id: user._id,
      token,
      expires_at: expiresAt
    });

    const { password_hash, ...userWithoutPassword } = user.toObject();

    return res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
});


router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, phone, date_of_birth, gender, password } = req.body;

    const existingUser = await Passenger.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Passenger.create({
      name,
      email,
      phone,
      date_of_birth,
      gender,
      password_hash: hashedPassword
    });

    const token = signToken({ passengerId: user._id, email: user.email });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await UserSession.create({
      passenger_id: user._id,
      token,
      expires_at: expiresAt
    });

    const { password_hash, ...userWithoutPassword } = user.toObject();

    return res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
});


router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = await UserSession.findOne({ 
      token,
      expires_at: { $gt: new Date() }
    });

    if (!session) {
      return res.status(401).json({ message: 'Session expired' });
    }

    const user = await Passenger.findById(session.passenger_id).select('-password_hash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
});


router.post('/logout', async (req: AuthRequest, res: Response) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await UserSession.deleteOne({ token });

    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Logout failed' });
  }
});

export default router;
