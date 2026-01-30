import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    console.log(`Generating token for ${userId}. Cookie options: secure=false, sameSite=lax`);
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false, // Ensure this is false for localhost debugging
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

export default generateToken;
