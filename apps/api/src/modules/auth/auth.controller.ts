import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '@synergylearn/db';
import { registerNewUser, loginUser, verifyGoogleTokenAndLogin } from './auth.service.js';
import type { RegisterUserInput, LoginUserInput } from './auth.dto.js';

const setAuthCookie = (res: Response, accessToken: string) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000, path: '/',
  });
};

export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, email: true, role: true, profile: { select: { firstName: true, lastName: true, avatarUrl: true } } }
    });
    res.status(200).json({ status: 'success', data: { user } });
  } catch (err) { next(err); }
}

export async function registerHandler(req: Request<{}, {}, RegisterUserInput>, res: Response, next: NextFunction) {
  try {
    const user = await registerNewUser(req.body);
    res.status(201).json({ status: 'success', data: { user } });
  } catch (err: any) {
    if (err.code === 'P2002') return res.status(409).json({ status: 'fail', message: 'Email already exists.' });
    next(err);
  }
}

export async function loginHandler(req: Request<{}, {}, LoginUserInput>, res: Response, next: NextFunction) {
  try {
    const accessToken = await loginUser(req.body);
    setAuthCookie(res, accessToken);
    res.status(200).json({ status: 'success', message: 'Logged in successfully' });
  } catch (err: any) { err.statusCode = 401; next(err); }
}

export function logoutHandler(req: Request, res: Response) {
  res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0), path: '/' });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
}

export async function googleLoginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ status: 'fail', message: 'Google token is required.' });
    const accessToken = await verifyGoogleTokenAndLogin(token);
    setAuthCookie(res, accessToken);
    res.status(200).json({ status: 'success', message: 'Logged in successfully with Google' });
  } catch (err: any) { err.statusCode = 401; next(err); }
}
