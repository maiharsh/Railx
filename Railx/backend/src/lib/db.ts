import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_HOST || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'railway_booking';

const mongoUri = `${MONGODB_URI}/${DB_NAME}`;

export async function connectDB() {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

export default mongoose;
