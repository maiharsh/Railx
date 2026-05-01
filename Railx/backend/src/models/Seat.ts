import mongoose, { Schema, Document } from 'mongoose';

export interface ISeat extends Document {
  _id: mongoose.Types.ObjectId;
  booking_id: mongoose.Types.ObjectId;
  seat_number: string;
  seat_class: 'General' | 'Sleeper' | 'AC1' | 'AC2' | 'AC3';
  berth_type: 'Lower' | 'Middle' | 'Upper' | 'Side';
  fare: number;
}

const seatSchema = new Schema<ISeat>(
  {
    booking_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    seat_number: { type: String, required: true },
    seat_class: {
      type: String,
      enum: ['General', 'Sleeper', 'AC1', 'AC2', 'AC3'],
      required: true
    },
    berth_type: {
      type: String,
      enum: ['Lower', 'Middle', 'Upper', 'Side'],
      required: true
    },
    fare: { type: Number, required: true }
  },
  { collection: 'seat' }
);

export default mongoose.model<ISeat>('Seat', seatSchema);
