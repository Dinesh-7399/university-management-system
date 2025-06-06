import { Router } from 'express';
import { registerHandler, loginHandler, logoutHandler, googleLoginHandler, meHandler } from './auth.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { registerUserDto, loginUserDto } from './auth.dto.js';

const authRouter = Router();

authRouter.post('/register', validate(registerUserDto), registerHandler);
authRouter.post('/login', validate(loginUserDto), loginHandler);
authRouter.post('/logout', logoutHandler);
authRouter.post('/google', googleLoginHandler);

authRouter.get('/me', isAuthenticated, meHandler);

export { authRouter };
