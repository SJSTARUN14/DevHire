import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = "sjstarun8@gmail.com";
        const user = await User.findOne({ email });
        if (user) {
            console.log(`User found: ${user.name} (${user.email}) - Role: ${user.role}`);
        } else {
            console.log(`User ${email} does not exist in the database.`);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
