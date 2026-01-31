import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || 587);

    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: port === 465, // true for 465, false for 587
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
            command: error.command,
            host: host,
            port: port
        });
        throw new Error(`Email delivery failed: ${error.message}`);
    }
};

export default sendEmail;
