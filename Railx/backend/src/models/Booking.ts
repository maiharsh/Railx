import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  passenger_id: mongoose.Types.ObjectId;
  schedule_id: mongoose.Types.ObjectId;
  pnr_number: string;
  booking_date: Date;
  total_fare: number;
  status: 'Confirmed' | 'Cancelled' | 'Pending';
  passenger_details?: Array<{
    name: string;
    age: number;
    gender: string;
  }>;
}

const bookingSchema = new Schema<IBooking>(
  {
    passenger_id: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true },
    schedule_id: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true },
    pnr_number: { type: String, required: true, unique: true },
    booking_date: { type: Date, default: Date.now },
    total_fare: { type: Number, required: true },
    status: { type: String, enum: ['Confirmed', 'Cancelled', 'Pending'], default: 'Confirmed' },
    passenger_details: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true }
      }
    ]
  },
  { collection: 'booking' }
);

export default mongoose.model<IBooking>('Booking', bookingSchema);
