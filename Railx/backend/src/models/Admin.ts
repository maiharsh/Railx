import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password_hash: string;
  role: 'super_admin' | 'admin' | 'manager';
  created_at: Date;
  last_login?: Date;
  is_active: boolean;
}

const adminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['super_admin', 'admin', 'manager'], default: 'admin' },
    created_at: { type: Date, default: Date.now },
    last_login: { type: Date },
    is_active: { type: Boolean, default: true }
  },
  { collection: 'admin' }
);

export default mongoose.model<IAdmin>('Admin', adminSchema);
