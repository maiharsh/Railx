import mongoose, { Schema, Document } from 'mongoose';

export interface IStation extends Document {
  _id: mongoose.Types.ObjectId;
  station_code: string;
  station_name: string;
  city: string;
  state: string;
}

const stationSchema = new Schema<IStation>(
  {
    station_code: { type: String, required: true, unique: true },
    station_name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  { collection: 'station' }
);

export default mongoose.model<IStation>('Station', stationSchema);
