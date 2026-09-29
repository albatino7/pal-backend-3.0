import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aggregation_pipeline_class';

    await mongoose.connect(mongoUri);

    return mongoose.connection;
}
