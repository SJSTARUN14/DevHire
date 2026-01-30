import User from '../models/User.js';
import Company from '../models/Company.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import axios from 'axios';
import mongoose from 'mongoose';

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(`Registration attempt: ${name} (${email}) | Role: ${role}`);

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database is currently unavailable.' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            if (!userExists.isVerified) {
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                userExists.otp = otp;
                userExists.otpExpires = Date.now() + 10 * 60 * 1000;
                await userExists.save();

                try {
                    await sendEmail({
                        email: userExists.email,
                        subject: 'Verify your DevHire account',
                        message: `Your verification code is: ${otp}. This code will expire in 10 minutes.`
                    });

                    return res.status(200).json({
                        message: 'User already exists but is not verified. A new OTP has been sent to your email.',
                        needsVerification: true,
                        email: userExists.email
                    });
                } catch (emailError) {
                    console.error("Existing User Email Fallback:", emailError.message);
                    userExists.isVerified = true;
                    userExists.otp = undefined;
                    userExists.otpExpires = undefined;
                    await userExists.save();

                    generateToken(res, userExists._id);
                    return res.status(200).json({
                        _id: userExists._id,
                        name: userExists.name,
                        email: userExists.email,
                        role: userExists.role,
                        isVerified: true,
                        message: 'Welcome back! Your account is now active.'
                    });
                }
            }
            return res.status(400).json({ message: 'User already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            name,
            email,
            password,
            role,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000
        });

        if (user) {
            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Verify your DevHire account',
                    message: `Welcome to DevHire! Your verification code is: ${otp}. This code will expire in 10 minutes.`
                });

                res.status(201).json({
                    message: 'Registration successful. Please check your email for the verification code.',
                    needsVerification: true,
                    email: user.email
                });
            } catch (emailError) {
                console.error("Email Fallback triggered:", emailError.message);
                // If email fails, let's just verify them so they aren't stuck
                user.isVerified = true;
                user.otp = undefined;
                user.otpExpires = undefined;
                await user.save();

                generateToken(res, user._id);
                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: true,
                    message: 'Account active. (Email delivery failed, but you are verified!)'
                });
            }
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database is currently unavailable.' });
        }

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Check if user's role matches the login selection
            if (role && user.role !== role) {
                return res.status(401).json({
                    message: `Invalid access. This account is registered as a ${user.role === 'student' ? 'Fresher' : 'Recruiter'}.`
                });
            }

            if (!user.isVerified) {
                return res.status(401).json({
                    message: 'Please verify your email address before logging in.',
                    needsVerification: true,
                    email: user.email
                });
            }

            console.log(`Setting login cookie for user: ${user.email}`);
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                studentProfile: user.studentProfile
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            if (user.role === 'student' && req.body.studentProfile) {
                user.studentProfile = { ...user.studentProfile, ...req.body.studentProfile };
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                companyId: updatedUser.companyId,
                studentProfile: updatedUser.studentProfile
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateReferral = async (req, res) => {
    try {
        const { jobTitle, companyName, location, jobId } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ message: 'AI Service is currently unavailable (API Key missing in server)' });
        }

        const prompt = `Generate a professional LinkedIn referral request message using this EXACT structure:

        Hi [Recipient Name],
        
        I came across the ${jobTitle} role at ${companyName} in ${location || 'N/A'} (JOB ID: ${jobId || 'N/A'}) and I’m very interested in this opportunity.
        
        It would really help me if you could consider referring me for this role.
        
        Thank you,
        [My Name]

        Rules:
        1. Fill in the placeholders like [Recipient Name] based on standard professional context but keep them as placeholders if unknown.
        2. Keep the core sentences EXACTLY as provided above.
        3. Output only the message text.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            return res.status(500).json({ message: 'AI returned an empty or invalid response' });
        }

        const message = response.data.candidates[0].content.parts[0].text;
        res.json({ message });
    } catch (error) {
        const errorDetail = error.response?.data?.error?.message || error.message;
        console.error('Gemini API Error Detail:', errorDetail);
        res.status(500).json({ message: `AI Service Error: ${errorDetail}` });
    }
};

export { registerUser, verifyOTP, loginUser, logoutUser, updateUserProfile, generateReferral };
