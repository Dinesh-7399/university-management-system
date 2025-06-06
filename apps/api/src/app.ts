// Modern ES Module imports - tsx handles this correctly
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

// Local imports
import { healthRouter } from './health';

const app = express();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to the SynergyLearn API' });
});
app.use('/api/v1/health', healthRouter);

// --- Basic Error Handler ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
