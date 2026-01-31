import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import atsRoutes from './routes/atsRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import sendEmail from './utils/sendEmail.js';

// Load our secret environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic setup: Parse JSON and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads')); // Make uploaded resumes accessible

// Friendly request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} request to ${req.url}`);
    next();
});

// Configure CORS - Let our frontend talk to the backend
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL,
    /\.onrender\.com$/ // Automatically allow any Render subdomains
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like from our own backend tests/mobile apps)
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) return allowed.test(origin);
            return allowed === origin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log("CORS blocked an unauthorized origin:", origin);
            callback(new Error('Sorry, this origin is not allowed by our security policy (CORS)'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Main API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/companies', companyRoutes);

// Health Check Endpoints - Useful for keeping the server awake and monitoring
app.get('/api/health/test-email', async (req, res) => {
    try {
        const email = req.query.email || process.env.SMTP_EMAIL;
        await sendEmail({
            email,
            subject: 'DevHire Connection Test',
            message: `Hi! This is a test from the DevHire server to confirm your email settings are working.`
        });
        res.json({ message: `Successfully sent a test email to ${email}` });
    } catch (error) {
        console.error('[Health Check] Email test failed:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting/Disconnected';
    res.json({
        status: 'The API is alive and kicking!',
        database: dbStatus,
        emailReady: !!(process.env.SMTP_HOST || process.env.RESEND_API_KEY),
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the DevHire API! The server is running smoothly.');
});

// Handle requests for pages that don't exist
app.use(notFound);
app.use(errorHandler);

// Start the server and connect to the database in parallel
const startServer = async () => {
    try {
        console.log('Connecting to the database...');
        await connectDB();
        console.log('Database connection established successfully!');
    } catch (error) {
        console.error(`Wait, there was a problem connecting to the database: ${error.message}`);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server is blasting off on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode!`);
    });
};

startServer();
