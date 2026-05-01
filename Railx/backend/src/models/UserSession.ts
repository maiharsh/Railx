import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSession extends Document {
  _id: mongoose.Types.ObjectId;
  passenger_id: mongoose.Types.ObjectId;
  token: string;
  created_at: Date;
  expires_at: Date;
}

const userSessionSchema = new Schema<IUserSession>(
  {
    passenger_id: { type: Schema.Types.ObjectId, ref: 'Passenger', required: true },
    token: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true }
  },
  { collection: 'user_session' }
);

export default mongoose.model<IUserSession>('UserSession', userSessionSchema);
