import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const sendEmail = async (options) => {
    // 1. HIGH-RELIABILITY OPTION: RESEND SDK
    if (process.env.RESEND_API_KEY) {
        try {
            console.log(`[RESEND] Attempting delivery to ${options.email}...`);
            const resend = new Resend(process.env.RESEND_API_KEY);

            const { data, error } = await resend.emails.send({
                from: process.env.FROM_EMAIL || 'DevHire <onboarding@resend.dev>',
                to: options.email,
                subject: options.subject,
                text: options.message,
            });

            if (error) {
                console.error('[RESEND ERROR]', error);
                throw new Error(error.message);
            }

            console.log('[RESEND] Email delivered successfully via SDK');
            return data;
        } catch (err) {
            console.error('[RESEND FALLBACK] SDK failed, trying SMTP...', err.message);
            // Continue to SMTP fallback if Resend fails
        }
    }

    // 2. STANDARD OPTION: NODEMAILER (Gmail/Other SMTP)
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
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 30000,
    });

    const message = {
        from: `"${process.env.FROM_NAME || 'DevHire'}" <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        console.log(`[SMTP] Attempting delivery to ${options.email} via ${host}:${port}...`);
        await transporter.sendMail(message);
        console.log('[SMTP] Email delivered successfully');
    } catch (error) {
        console.error('[SMTP ERROR]', {
            message: error.message,
            code: error.code,
            host: host,
            port: port
        });
        throw new Error(`Email delivery failed: ${error.message}`);
    }
};

export default sendEmail;
