import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'recruiter', 'company', 'admin'], required: true }, 

    
    studentProfile: {
        resume: { type: String }, 
        resumeOriginalName: { type: String },
        skills: [{ type: String }],
        education: [{
            degree: String,
            college: String,
            batch: String, 
        }],
        experience: [{
            role: String,
            company: String,
            duration: String,
        }],
        photo: { type: String }
    },

    
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

    
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },

    
    geminiApiKey: { type: String, select: false }, 

}, { timestamps: true });


userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
