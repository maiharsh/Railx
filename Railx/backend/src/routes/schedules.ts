import { Router, Response } from 'express';
import Schedule from '../models/Schedule';
import { AuthRequest } from '../middleware/auth';

const router = Router();


router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id)
      .populate('train_id')
      .populate('from_station')
      .populate('to_station');

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    const result = {
      ...schedule.toObject(),
      train_name: (schedule.train_id as any)?.train_name,
      train_number: (schedule.train_id as any)?.train_number,
      train_type: (schedule.train_id as any)?.train_type,
      from_station_name: (schedule.from_station as any)?.station_name,
      from_city: (schedule.from_station as any)?.city,
      to_station_name: (schedule.to_station as any)?.station_name,
      to_city: (schedule.to_station as any)?.city
    };

    return res.json(result);
  } catch (error) {
    console.error('Get schedule error:', error);
    return res.status(500).json({ message: 'Failed to fetch schedule' });
  }
});

export default router;