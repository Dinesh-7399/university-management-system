import { Router } from 'express';
import { getAllUsersHandler } from './users.controller.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { checkPermissions } from '../../middleware/checkPermissions.js';

const usersRouter = Router();

// Route: GET /api/v1/users
// Desc: Get all users (Admin only)
usersRouter.get(
  '/',
  isAuthenticated, // 1. Check if user is logged in
  checkPermissions(['ADMIN', 'SYS_ADMIN']), // 2. Check if user has ADMIN or SYS_ADMIN role
  getAllUsersHandler
);

export { usersRouter };
