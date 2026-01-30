import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const promoteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = "sjstarun8@gmail.com";

        const result = await User.updateOne(
            { email },
            { $set: { role: 'company' } }
        );

        if (result.matchedCount > 0) {
            console.log(`SUCCESS: User ${email} has been promoted to 'company' role.`);
            console.log("Please re-login to see the changes.");
        } else {
            console.log(`ERROR: User ${email} not found in the local database.`);
            console.log("Please make sure you have registered locally first.");
        }
        process.exit(0);
    } catch (error) {
        console.error("ERROR:", error.message);
        process.exit(1);
    }
};

promoteUser();
