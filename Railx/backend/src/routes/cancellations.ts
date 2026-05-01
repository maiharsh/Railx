import { Router, Response } from 'express';
import Booking from '../models/Booking';
import Schedule from '../models/Schedule';
import Seat from '../models/Seat';
import Cancellation from '../models/Cancellation';
import Payment from '../models/Payment';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();


router.post('/cancel/:booking_id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { booking_id } = req.params;
    const { cancellation_reason } = req.body;
    const passengerId = (req.user as any).passengerId;

    const booking = await Booking.findById(booking_id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.passenger_id.toString() !== passengerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    
    const schedule = await Schedule.findById(booking.schedule_id);
    const travelDate = new Date(schedule!.travel_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    travelDate.setHours(0, 0, 0, 0);

    if (travelDate < today) {
      return res.status(400).json({ message: 'Cannot cancel past bookings' });
    }

    
    const daysUntilTravel = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let refundPercentage = 100;

    if (daysUntilTravel <= 1) {
      refundPercentage = 0; 
    } else if (daysUntilTravel <= 7) {
      refundPercentage = 50; 
    } else {
      refundPercentage = 90; 
    }

    const cancellationCharges = booking.total_fare * (1 - refundPercentage / 100);
    const refundAmount = booking.total_fare - cancellationCharges;

    
    const cancellation = await Cancellation.create({
      booking_id,
      passenger_id: passengerId,
      cancellation_reason,
      refund_amount: refundAmount,
      cancellation_charges: cancellationCharges,
      refund_status: 'processed'
    });

    
    await Booking.findByIdAndUpdate(booking_id, { status: 'Cancelled' });

    
    const seats = await Seat.find({ booking_id });
    const seatCount = seats.length;

    await Schedule.findByIdAndUpdate(
      booking.schedule_id,
      { $inc: { available_seats: seatCount } }
    );

    
    await Seat.deleteMany({ booking_id });

    
    await Payment.updateMany(
      { booking_id },
      {
        status: 'refunded',
        refund_amount: refundAmount,
        refund_date: new Date()
      }
    );

    return res.json({
      message: 'Booking cancelled successfully',
      cancellation_id: cancellation._id,
      refund_amount: refundAmount,
      cancellation_charges: cancellationCharges,
      refund_status: 'processed'
    });
  } catch (error) {
    console.error('Cancellation error:', error);
    return res.status(500).json({ message: 'Cancellation failed' });
  }
});


router.get('/:booking_id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { booking_id } = req.params;

    const cancellation = await Cancellation.findOne({ booking_id })
      .populate('booking_id')
      .populate('passenger_id');

    if (!cancellation) {
      return res.status(404).json({ message: 'Cancellation not found' });
    }

    return res.json(cancellation);
  } catch (error) {
    console.error('Get cancellation error:', error);
    return res.status(500).json({ message: 'Failed to fetch cancellation' });
  }
});


router.get('/user/my-cancellations', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const passengerId = (req.user as any).passengerId;

    const cancellations = await Cancellation.find({ passenger_id: passengerId })
      .populate('booking_id')
      .sort({ cancellation_date: -1 });

    return res.json(cancellations);
  } catch (error) {
    console.error('Get user cancellations error:', error);
    return res.status(500).json({ message: 'Failed to fetch cancellations' });
  }
});

export default router;
