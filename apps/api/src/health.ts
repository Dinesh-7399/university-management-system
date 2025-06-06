import { Router, Request, Response } from 'express';
import prisma from './lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    // Log that a health check is being attempted
    console.log('[Health Check] Received request. Attempting to query database...');
    
    try {
        await prisma.$queryRawUnsafe('SELECT 1');

        // Log the success message
        console.log('[Health Check] SUCCESS: Database connection is healthy.');

        res.status(200).json({
            status: 'ok',
            db_connection: 'healthy',
        });
    } catch (error) {
        // Log the specific error for debugging
        console.error('[Health Check] FAILED: Database connection is unhealthy.', error);
        
        res.status(503).json({
            status: 'error',
            db_connection: 'unhealthy',
            error: (error as Error).message, // Also provide the error message in the API response
        });
    }
});

export { router as healthRouter };
