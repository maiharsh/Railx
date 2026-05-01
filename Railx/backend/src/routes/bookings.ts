import { Router, Response } from 'express';
import Booking from '../models/Booking';
import Schedule from '../models/Schedule';
import Seat from '../models/Seat';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/create', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { schedule_id, seats, passenger_details } = req.body;
    const passengerId = (req.user as any).passengerId;

    const schedule = await Schedule.findById(schedule_id);

    if (!schedule || schedule.available_seats < seats.length) {
      return res.status(400).json({ message: 'No seats available' });
    }

    const travelDate = new Date(schedule.travel_date);
    travelDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (travelDate < today) {
      return res.status(400).json({ message: 'Cannot book a past date schedule.' });
    }

    const pnrNumber = `PNR${Date.now()}${Math.floor(Math.random() * 10000)}`;

    const booking = await Booking.create({
      passenger_id: passengerId,
      schedule_id,
      pnr_number: pnrNumber,
      total_fare: schedule.base_fare * seats.length,
      passenger_details: passenger_details
    });

    for (const seat of seats) {
      await Seat.create({
        booking_id: booking._id,
        seat_number: seat.number,
        seat_class: seat.class,
        berth_type: seat.berth_type,
        fare: schedule.base_fare
      });
    }

    await Schedule.findByIdAndUpdate(schedule_id, {
      available_seats: schedule.available_seats - seats.length
    });

    return res.json({
      booking_id: booking._id,
      pnr_number: pnrNumber,
      message: 'Booking confirmed'
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: 'Booking failed. Please try again.' });
  }
});


router.get('/my-bookings', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const passengerId = (req.user as any).passengerId;

    const bookings = await Booking.find({ passenger_id: passengerId })
      .populate({
        path: 'schedule_id',
        populate: [
          { path: 'train_id', select: 'train_name train_number' },
          { path: 'from_station', select: 'station_name' },
          { path: 'to_station', select: 'station_name' }
        ]
      })
      .sort({ 'schedule_id.travel_date': 1, 'booking_date': -1 });

    const result = bookings.map(booking => {
      const schedule = booking.schedule_id as any;
      
      if (!schedule) {
        return {
          ...booking.toObject(),
          travel_date: null,
          base_fare: null,
          from_station_name: "Deleted",
          to_station_name: "Deleted",
          train_name: "Deleted Schedule",
          train_number: "N/A"
        };
      }

      return {
        ...booking.toObject(),
        travel_date: schedule.travel_date,
        base_fare: schedule.base_fare,
        from_station_name: schedule.from_station?.station_name,
        to_station_name: schedule.to_station?.station_name,
        train_name: schedule.train_id?.train_name,
        train_number: schedule.train_id?.train_number
      };
    });

    return res.json(result);
  } catch (error) {
    console.error('My bookings error:', error);
    return res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

export default router;
