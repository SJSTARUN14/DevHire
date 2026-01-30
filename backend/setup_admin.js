import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const setupAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = "sjstarun8@gmail.com";
        const password = "Tarun@2003";

        // Hash password manually for updateOne
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await User.updateOne(
            { email },
            {
                $set: {
                    role: 'company',
                    password: hashedPassword
                }
            },
            { upsert: true } // Create if not exists
        );

        if (result.upsertedCount > 0) {
            console.log(`SUCCESS: Admin user ${email} created with 'company' role.`);
        } else {
            console.log(`SUCCESS: Admin user ${email} updated with 'company' role and specified password.`);
        }
        process.exit(0);
    } catch (error) {
        console.error("ERROR:", error.message);
        process.exit(1);
    }
};

setupAdmin();
