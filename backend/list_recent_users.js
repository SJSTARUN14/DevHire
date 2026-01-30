import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find().sort({ createdAt: -1 }).limit(10);
        console.log("Recent Registrations:");
        users.forEach(u => {
            console.log(`- ${u.name} (${u.email}) | Role: ${u.role} | Verified: ${u.isVerified}`);
        });
        process.exit(0);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

listUsers();
