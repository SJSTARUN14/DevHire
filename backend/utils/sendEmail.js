import nodemailer from 'nodemailer';
import { Resend } from 'resend';


const sendEmail = async (options) => {
    
    if (process.env.RESEND_API_KEY) {
        try {
            console.log(`[Email] Attempting to reach ${options.email} via Resend...`);
            const resend = new Resend(process.env.RESEND_API_KEY);

            const from = process.env.FROM_EMAIL || 'onboarding@resend.dev';

            const { data, error } = await resend.emails.send({
                from: `DevHire <${from}>`,
                to: options.email,
                subject: options.subject,
                text: options.message,
            });

            if (error) {
                console.error('[Email Error] Resend reported a problem:', error.message);
                
                throw new Error(`Email Service Error: ${error.message}${error.message.includes('verify') ? ' (Tip: You might need to add this recipient to your Resend tester list or verify your domain)' : ''}`);
            }

            console.log('[Email] Success! Message sent via Resend SDK.');
            return data;
        } catch (err) {
            console.error('[Email Critical] Resend failed and we cannot fallback to SMTP on this platform:', err.message);
            throw err;
        }
    }

    
    console.warn('[Email Warning] No Resend API key found. Falling back to legacy SMTP...');

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || 587);

    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465, 
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: { rejectUnauthorized: false }, 
        connectionTimeout: 20000,
    });

    const message = {
        from: `"${process.env.FROM_NAME || 'DevHire'}" <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        console.log(`[Email] Sending to ${options.email} via ${host}...`);
        await transporter.sendMail(message);
        console.log('[Email] Success! Message delivered via SMTP.');
    } catch (error) {
        console.error('[Email Error] SMTP delivery failed:', error.message);
        throw new Error(`Email delivery failed (SMTP): ${error.message}`);
    }
};

export default sendEmail;
