import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  booking_id: mongoose.Types.ObjectId;
  passenger_id: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  payment_method: 'card' | 'upi' | 'net_banking' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id: string;
  payment_date: Date;
  refund_date?: Date;
  refund_amount?: number;
  error_message?: string;
}

const paymentSchema = new Schema<IPayment>(
  {
    booking_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    passenger_id: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    payment_method: { 
      type: String, 
      enum: ['card', 'upi', 'net_banking', 'wallet'],
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transaction_id: { type: String, unique: true, required: true },
    payment_date: { type: Date, default: Date.now },
    refund_date: { type: Date },
    refund_amount: { type: Number },
    error_message: { type: String }
  },
  { collection: 'payment' }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);
