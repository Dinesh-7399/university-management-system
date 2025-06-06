import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_32_chars';
export const makeOptionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
            req.user = { id: decoded.userId, role: decoded.role };
        } catch (err) { req.user = undefined; }
    }
    return next();
};
