import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../utils/api-error';

export const validate =
  (schema: AnyZodObject) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const parsed = await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });

        // Assign coerced/validated values back to request
        req.body = parsed.body;
        req.query = parsed.query;
        req.params = parsed.params;

        next();
      } catch (error) {
        console.log("error", error)
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map((err) => ({
            field: err.path.slice(1).join('.'), // slice(1) removes the root 'body', 'query', or 'params' keys
            message: err.message,
          }));
          next(ApiError.badRequest('Validation failed', formattedErrors));
        } else {
          next(error);
        }
      }
    };
