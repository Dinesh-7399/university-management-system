import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@synergylearn/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key_32_chars';

declare global {
  namespace Express { export interface Request { user?: { id: string; role: string; }; } }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'You are not logged in.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'The user for this token no longer exists.' });
    }
    req.user = currentUser;
    return next();
  } catch (err: any) {
    // Clear the expired cookie on the client
    res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0) });
    return res.status(401).json({ status: 'fail', message: 'Your session is invalid or has expired.' });
  }
};
