import { Router, Response } from 'express';
import Train from '../models/Train';
import Schedule from '../models/Schedule';
import Booking from '../models/Booking';
import Payment from '../models/Payment';
import Passenger from '../models/Passenger';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();




router.get('/trains', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const trains = await Train.find()
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await Train.countDocuments();

    return res.json({
      trains,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get trains error:', error);
    return res.status(500).json({ message: 'Failed to fetch trains' });
  }
});


router.post('/trains', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { train_name, train_number, train_type, total_seats } = req.body;

    const existingTrain = await Train.findOne({ train_number });
    if (existingTrain) {
      return res.status(400).json({ message: 'Train number already exists' });
    }

    const train = await Train.create({
      train_name,
      train_number,
      train_type,
      total_seats
    });

    return res.status(201).json({
      message: 'Train created successfully',
      train
    });
  } catch (error) {
    console.error('Create train error:', error);
    return res.status(500).json({ message: 'Failed to create train' });
  }
});


router.put('/trains/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { train_name, train_number, train_type, total_seats } = req.body;

    const train = await Train.findByIdAndUpdate(
      id,
      { train_name, train_number, train_type, total_seats },
      { new: true }
    );

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    return res.json({
      message: 'Train updated successfully',
      train
    });
  } catch (error) {
    console.error('Update train error:', error);
    return res.status(500).json({ message: 'Failed to update train' });
  }
});


router.delete('/trains/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const train = await Train.findByIdAndDelete(id);

    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    
    await Schedule.deleteMany({ train_id: id });

    return res.json({ message: 'Train deleted successfully' });
  } catch (error) {
    console.error('Delete train error:', error);
    return res.status(500).json({ message: 'Failed to delete train' });
  }
});




router.get('/schedules', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const limit = req.query.limit as string;

    const query = Schedule.find()
      .populate('train_id')
      .populate('from_station')
      .populate('to_station')
      .sort({ travel_date: -1 });

    let schedules;
    if (limit === 'all') {
      schedules = await query;
    } else {
      const pageLimit = parseInt(limit) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * pageLimit;
      schedules = await query.skip(skip).limit(pageLimit);
    }

    const total = await Schedule.countDocuments();

    return res.json({
      schedules,
      pagination: {
        limit: limit === 'all' ? total : parseInt(limit) || 10,
        total,
      }
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    return res.status(500).json({ message: 'Failed to fetch schedules' });
  }
});


router.post('/schedules', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { train_id, travel_date, from_station, to_station, available_seats, base_fare } = req.body;

    const schedule = await Schedule.create({
      train_id,
      travel_date,
      from_station,
      to_station,
      available_seats,
      base_fare
    });

    return res.status(201).json({
      message: 'Schedule created successfully',
      schedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    return res.status(500).json({ message: 'Failed to create schedule' });
  }
});


router.put('/schedules/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { travel_date, available_seats, base_fare } = req.body;

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { travel_date, available_seats, base_fare },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    return res.json({
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    return res.status(500).json({ message: 'Failed to update schedule' });
  }
});


router.delete('/schedules/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    return res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    return res.status(500).json({ message: 'Failed to delete schedule' });
  }
});




router.get('/bookings', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status as string;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('passenger_id')
      .populate({
        path: 'schedule_id',
        populate: [
          { path: 'train_id' },
          { path: 'from_station' },
          { path: 'to_station' }
        ]
      })
      .skip(skip)
      .limit(limit)
      .sort({ booking_date: -1 });

    const total = await Booking.countDocuments(filter);

    return res.json({
      bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});


router.get('/bookings/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('passenger_id')
      .populate({
        path: 'schedule_id',
        populate: [
          { path: 'train_id' },
          { path: 'from_station' },
          { path: 'to_station' }
        ]
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    return res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return res.status(500).json({ message: 'Failed to fetch booking' });
  }
});




router.get('/stats/dashboard', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalPassengers = await Passenger.countDocuments();
    const totalTrains = await Train.countDocuments();
    const totalSchedules = await Schedule.countDocuments();
    
    const completedBookings = await Booking.countDocuments({ status: 'Confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });
    
    const revenueData = await Booking.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: '$total_fare' } } }
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    return res.json({
      totalBookings,
      totalPassengers,
      totalTrains,
      totalSchedules,
      completedBookings,
      cancelledBookings,
      totalRevenue
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});


router.get('/stats/bookings', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const bookingsByDate = await Booking.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$booking_date' } },
          count: { $sum: 1 },
          revenue: { $sum: '$total_fare' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]);

    return res.json({
      byStatus: bookingsByStatus,
      byDate: bookingsByDate
    });
  } catch (error) {
    console.error('Get booking analytics error:', error);
    return res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

export default router;
