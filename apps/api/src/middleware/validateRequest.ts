import { type Request, type Response, type NextFunction } from 'express';
import { type AnyZodObject, ZodError } from 'zod';

// This is a higher-order function that takes a schema and returns Express middleware
export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // The schema will validate req.body, req.query, and req.params
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Return a structured error response
        const formattedErrors = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        return res.status(400).json({ status: 'fail', errors: formattedErrors });
      }
      // Pass other errors to the global error handler
      return next(error);
    }
  };
