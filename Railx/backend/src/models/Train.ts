import mongoose, { Schema, Document } from 'mongoose';

export interface ITrain extends Document {
  _id: mongoose.Types.ObjectId;
  train_number: string;
  train_name: string;
  total_seats: number;
  train_type: 'Express' | 'Superfast' | 'Passenger' | 'Rajdhani';
}

const trainSchema = new Schema<ITrain>(
  {
    train_number: { type: String, required: true, unique: true },
    train_name: { type: String, required: true },
    total_seats: { type: Number, required: true },
    train_type: {
      type: String,
      enum: ['Express', 'Superfast', 'Passenger', 'Rajdhani'],
      required: true
    }
  },
  { collection: 'train' }
);

export default mongoose.model<ITrain>('Train', trainSchema);
