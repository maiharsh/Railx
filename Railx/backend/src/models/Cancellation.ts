import mongoose, { Schema, Document } from 'mongoose';

export interface ICancellation extends Document {
  _id: mongoose.Types.ObjectId;
  booking_id: mongoose.Types.ObjectId;
  passenger_id: mongoose.Types.ObjectId;
  cancellation_reason: string;
  refund_amount: number;
  refund_status: 'pending' | 'processed' | 'rejected';
  cancellation_date: Date;
  refund_date?: Date;
  cancellation_charges: number;
}

const cancellationSchema = new Schema<ICancellation>(
  {
    booking_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    passenger_id: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true },
    cancellation_reason: { type: String, required: true },
    refund_amount: { type: Number, required: true },
    refund_status: { 
      type: String, 
      enum: ['pending', 'processed', 'rejected'],
      default: 'pending'
    },
    cancellation_date: { type: Date, default: Date.now },
    refund_date: { type: Date },
    cancellation_charges: { type: Number, default: 0 }
  },
  { collection: 'cancellation' }
);

export default mongoose.model<ICancellation>('Cancellation', cancellationSchema);
