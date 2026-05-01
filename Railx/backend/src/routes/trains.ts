import { Router, Response } from 'express';
import mongoose from 'mongoose';
import Station from '../models/Station';
import Schedule from '../models/Schedule';
import { AuthRequest } from '../middleware/auth';

const router = Router();


router.get('/search', async (req: AuthRequest, res: Response) => {
  try {
    const fromStationQuery = req.query.from as string;
    const toStationQuery = req.query.to as string;
    const travelDate = req.query.date as string;

    
    let fromStation = null;
    let toStation = null;

    if (fromStationQuery) {
      fromStation = await Station.findOne({
        $or: [
          { station_code: { $regex: fromStationQuery, $options: 'i' } },
          { station_name: { $regex: fromStationQuery, $options: 'i' } },
          { city: { $regex: fromStationQuery, $options: 'i' } },
          { _id: mongoose.Types.ObjectId.isValid(fromStationQuery) ? fromStationQuery : null }
        ].filter(q => q !== null)
      });

      if (!fromStation) {
        return res.status(404).json({ message: `From station "${fromStationQuery}" not found` });
      }
    }

    if (toStationQuery) {
      toStation = await Station.findOne({
        $or: [
          { station_code: { $regex: toStationQuery, $options: 'i' } },
          { station_name: { $regex: toStationQuery, $options: 'i' } },
          { city: { $regex: toStationQuery, $options: 'i' } },
          { _id: mongoose.Types.ObjectId.isValid(toStationQuery) ? toStationQuery : null }
        ].filter(q => q !== null)
      });

      if (!toStation) {
        return res.status(404).json({ message: `To station "${toStationQuery}" not found` });
      }
    }

    const filter: any = {
      available_seats: { $gt: 0 }
    };

    if (fromStation) {
      filter.from_station = fromStation._id;
    }
    if (toStation) {
      filter.to_station = toStation._id;
    }

    if (travelDate) {
      const requestedDate = new Date(travelDate);
      requestedDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(requestedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }

      if (requestedDate < today) {
        return res.status(400).json({ message: 'Cannot search past date schedules' });
      }

      const nextDate = new Date(requestedDate);
      nextDate.setDate(nextDate.getDate() + 1);

      filter.travel_date = {
        $gte: requestedDate,
        $lt: nextDate
      };
    }

    const schedules = await Schedule.find(filter)
      .populate('train_id')
      .populate('from_station')
      .populate('to_station')
      .sort(travelDate ? { base_fare: 1 } : { travel_date: 1 });

    const trains = schedules.map(schedule => ({
      ...schedule.toObject(),
      train_id: schedule.train_id,
      from_station_name: (schedule.from_station as any)?.station_name,
      from_city: (schedule.from_station as any)?.city,
      to_station_name: (schedule.to_station as any)?.station_name,
      to_city: (schedule.to_station as any)?.city
    }));

    return res.json(trains);
  } catch (error) {
    console.error('Trains search error:', error);
    return res.status(500).json({ message: 'Failed to fetch trains', error: String(error) });
  }
});

export default router;
