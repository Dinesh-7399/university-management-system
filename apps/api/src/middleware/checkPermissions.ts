import { type Request, type Response, type NextFunction } from 'express';
import { type UserRole } from '@synergylearn/db';

/**
 * Higher-order function to create role-based authorization middleware.
 * This middleware must run AFTER 'isAuthenticated'.
 * @param allowedRoles An array of roles that are permitted to access the route.
 */
export const checkPermissions = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user is attached by the 'isAuthenticated' middleware
    const user = req.user;

    if (!user) {
      // This case should technically be caught by isAuthenticated, but it's good practice
      return res.status(401).json({ status: 'fail', message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      // User is authenticated, but does not have the necessary permission
      return res.status(403).json({
        status: 'fail',
        message: "You do not have permission to perform this action.",
      });
    }

    // If we reach here, the user has the required role.
    return next();
  };
};
