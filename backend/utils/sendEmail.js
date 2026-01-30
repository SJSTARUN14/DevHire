import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for 587
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 20000, // 20 seconds
        greetingTimeout: 20000,
        socketTimeout: 20000,
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
