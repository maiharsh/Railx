import { Router, Response } from 'express';
import Station from '../models/Station';
import { AuthRequest } from '../middleware/auth';

const router = Router();


router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const searchTerm = req.query.q as string;

    let stations;
    if (searchTerm) {
      stations = await Station.find({
        $or: [
          { station_code: { $regex: searchTerm, $options: 'i' } },
          { station_name: { $regex: searchTerm, $options: 'i' } },
          { city: { $regex: searchTerm, $options: 'i' } }
        ]
      }).limit(20);
    } else {
      stations = await Station.find().limit(50);
    }

    return res.json(stations);
  } catch (error) {
    console.error('Stations error:', error);
    return res.status(500).json({ message: 'Failed to fetch stations' });
  }
});

export default router;
