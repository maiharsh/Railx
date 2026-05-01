import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  _id: mongoose.Types.ObjectId;
  train_id: mongoose.Types.ObjectId;
  travel_date: Date;
  from_station: mongoose.Types.ObjectId;
  to_station: mongoose.Types.ObjectId;
  available_seats: number;
  base_fare: number;
}

const scheduleSchema = new Schema<ISchedule>(
  {
    train_id: { type: Schema.Types.ObjectId, ref: 'Train', required: true },
    travel_date: { type: Date, required: true },
    from_station: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
    to_station: { type: Schema.Types.ObjectId, ref: 'Station', required: true },
    available_seats: { type: Number, required: true },
    base_fare: { type: Number, required: true }
  },
  { collection: 'schedule' }
);

export default mongoose.model<ISchedule>('Schedule', scheduleSchema);
