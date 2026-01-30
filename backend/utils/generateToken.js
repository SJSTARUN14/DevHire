import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.FRONTEND_URL;

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: isProduction, // Secure true on production (HTTPS)
        sameSite: isProduction ? 'none' : 'lax', // Needed for cross-domain on Render
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

export default generateToken;
