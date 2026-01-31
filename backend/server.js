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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (Original: ${req.originalUrl})`);
    next();
});
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL,
    /\.onrender\.com$/, // Allow any Render app
    /[a-z0-9-]+\.onrender\.com$/
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow if no origin (like mobile apps/curl) or if it matches our list
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some(allowed => {
            if (allowed instanceof RegExp) return allowed.test(origin);
            return allowed === origin;
        });

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/companies', companyRoutes);

// Root API routes for health checks
app.get('/api/health/test-email', async (req, res) => {
    try {
        const email = req.query.email || process.env.SMTP_EMAIL;
        await sendEmail({
            email,
            subject: 'DevHire SMTP Test',
            message: `SMTP testing successful! This email was sent at ${new Date().toISOString()}`
        });
        res.json({ message: `Test email sent successfully to ${email}` });
    } catch (error) {
        console.error('[HEALTH TEST ERROR]', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({
        status: 'API is running',
        database: dbStatus,
        smtpConfigured: !!(process.env.SMTP_HOST || process.env.RESEND_API_KEY),
        nodeEnv: process.env.NODE_ENV,
        frontEndUrl: process.env.FRONTEND_URL,
        timestamp: new Date().toISOString()
    });
});

app.get('/api', (req, res) => {
    res.json({ message: 'DevHire API is running', version: '1.0.0' });
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Database and Server Start
const startServer = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await connectDB();
        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
    }

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
};

startServer();
