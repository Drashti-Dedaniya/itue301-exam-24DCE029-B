import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: new URL('../.env', import.meta.url) });

export async function connectMongoDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required to connect to MongoDB.');
  }
  await mongoose.connect(process.env.MONGO_URI);
  return mongoose.connection;
}

export function formatMongooseError(error) {
  if (error.name === 'ValidationError') {
    return {
      statusCode: 400,
      message: Object.values(error.errors).map((item) => item.message).join('; '),
    };
  }
  if (error.code === 11000) {
    return { statusCode: 409, message: 'A record with this unique value already exists.' };
  }
  return { statusCode: 500, message: 'A database error occurred.' };
}
