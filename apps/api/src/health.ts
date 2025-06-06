import { Router } from 'express';
import { prisma } from '@synergylearn/db';

const healthRouter = Router();

healthRouter.get('/v1/health', async (_req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      message: 'API is healthy and connected to the database.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: 'ERROR',
      message: 'API is running but the database is unreachable.',
    });
    next(error);
  }
});

export { healthRouter };