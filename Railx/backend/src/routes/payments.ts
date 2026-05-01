import { Router, Response } from 'express';
import Payment from '../models/Payment';
import Booking from '../models/Booking';
import { AuthRequest, authenticateToken } from '../middleware/auth';

const router = Router();


router.post('/process', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { booking_id, amount, payment_method } = req.body;
    const passengerId = (req.user as any).passengerId;

    const booking = await Booking.findById(booking_id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.passenger_id.toString() !== passengerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
    
    
    const isSuccess = Math.random() > 0.1;

    const payment = await Payment.create({
      booking_id,
      passenger_id: passengerId,
      amount,
      payment_method,
      transaction_id: transactionId,
      status: isSuccess ? 'completed' : 'failed',
      error_message: isSuccess ? null : 'Payment gateway error'
    });

    if (isSuccess) {
      
      await Booking.findByIdAndUpdate(booking_id, { status: 'Confirmed' });

      return res.json({
        success: true,
        message: 'Payment successful',
        transaction_id: transactionId,
        payment
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.',
        transaction_id: transactionId
      });
    }
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ message: 'Payment processing failed' });
  }
});


router.get('/status/:transaction_id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { transaction_id } = req.params;

    const payment = await Payment.findOne({ transaction_id });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    return res.json(payment);
  } catch (error) {
    console.error('Get payment status error:', error);
    return res.status(500).json({ message: 'Failed to fetch payment status' });
  }
});


router.get('/my-payments', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const passengerId = (req.user as any).passengerId;

    const payments = await Payment.find({ passenger_id: passengerId })
      .populate('booking_id')
      .sort({ payment_date: -1 });

    return res.json(payments);
  } catch (error) {
    console.error('Get user payments error:', error);
    return res.status(500).json({ message: 'Failed to fetch payments' });
  }
});


router.post('/refund/:booking_id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { booking_id } = req.params;
    const passengerId = (req.user as any).passengerId;

    const payment = await Payment.findOne({ booking_id });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.passenger_id.toString() !== passengerId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }

    
    const refundAmount = payment.amount * 0.9; 

    await Payment.findByIdAndUpdate(payment._id, {
      status: 'refunded',
      refund_amount: refundAmount,
      refund_date: new Date()
    });

    return res.json({
      message: 'Refund processed successfully',
      refund_amount: refundAmount
    });
  } catch (error) {
    console.error('Refund error:', error);
    return res.status(500).json({ message: 'Refund processing failed' });
  }
});

export default router;
