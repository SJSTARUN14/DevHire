import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const sendEmail = async (options) => {
    // 1. HIGH-RELIABILITY OPTION: RESEND SDK
    if (process.env.RESEND_API_KEY) {
        try {
            console.log(`[RESEND] Attempting delivery to ${options.email}...`);
            const resend = new Resend(process.env.RESEND_API_KEY);

            const from = process.env.FROM_EMAIL || 'onboarding@resend.dev';

            const { data, error } = await resend.emails.send({
                from: `DevHire <${from}>`,
                to: options.email,
                subject: options.subject,
                text: options.message,
            });

            if (error) {
                console.error('[RESEND ERROR]', error.message);
                // If it's a restriction error, we report it clearly
                if (error.message.includes('test') || error.message.includes('verified')) {
                    throw new Error(`Resend Free Tier: Only allowed to send to account owner. Verify a domain to send to others.`);
                }
                throw new Error(error.message);
            }

            console.log('[RESEND] Email delivered successfully via SDK');
            return data;
        } catch (err) {
            console.warn('[RESEND FALLBACK]', err.message);
            // If it's the unverified recipient error, don't try SMTP backup as it will fail too
            if (err.message.includes('Verify a domain')) {
                throw err;
            }
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
        tls: { rejectUnauthorized: false },
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
        console.error('[SMTP ERROR]', error.message);
        throw new Error(`Email delivery failed: ${error.message} (Check Render Network Logs)`);
    }
};

export default sendEmail;
