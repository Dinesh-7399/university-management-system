import express, { type Request, type Response, type NextFunction, type Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import { healthRouter } from './health.js';
import { authRouter } from './modules/auth/auth.routes.js';

const app: Application = express();

app.use(cors({ origin: true, credentials: true })); // Enable CORS with credentials for cookies
app.use(express.json());
app.use(cookieParser()); // Use the cookie-parser middleware HERE

const apiV1Router = express.Router();
apiV1Router.use('/health', healthRouter);
apiV1Router.use('/auth', authRouter);

app.use('/api/v1', apiV1Router);

app.use('/', (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "SynergyLearn API is live!" });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ status: 'error', message: err.message || 'An internal server error occurred.' });
});

export { app };
