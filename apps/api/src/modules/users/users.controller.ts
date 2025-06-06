import { type Request, type Response, type NextFunction } from 'express';
import { getAllUsers } from './users.service.js';

export async function getAllUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (err) {
    return next(err);
  }
}
