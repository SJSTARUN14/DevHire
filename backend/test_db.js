import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const testConnection = async () => {
    console.log('Testing MongoDB Connection...');
    console.log('URI:', process.env.MONGO_URI);
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('SUCCESS: Connected to MongoDB!');
        process.exit(0);
    } catch (error) {
        console.error('ERROR: Could not connect to MongoDB.');
        console.error('Reason:', error.message);
        console.error('Hint: Check if your MongoDB server is running.');
        process.exit(1);
    }
};

testConnection();
