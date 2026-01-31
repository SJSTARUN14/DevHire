import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_PORT == 465, // true for 465, false for others
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    try {
        console.log(`Attempting to send email to ${options.email} via ${transporter.options.host}:${transporter.options.port}`);
        await transporter.sendMail(message);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('SMTP Error Detail:', {
            message: error.message,
            code: error.code,
            command: error.command,
            host: transporter.options.host,
            port: transporter.options.port
        });
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};

export default sendEmail;
