import mongoose, { Schema, Document } from 'mongoose';

export interface IPassenger extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  gender: 'Male' | 'Female' | 'Other';
  password_hash: string;
  created_at: Date;
}

const passengerSchema = new Schema<IPassenger>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    password_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
  },
  { collection: 'passenger' }
);

export default mongoose.model<IPassenger>('Passenger', passengerSchema);
