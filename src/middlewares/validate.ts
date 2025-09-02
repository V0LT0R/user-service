import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ error: 'ValidationError', details: e.flatten() });
      }
      next(e);
    }
  };
}

export function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ error: 'Invalid params', details: e.flatten() });
      }
      return res.status(400).json({ error: 'Invalid params' });
    }
  };
}

export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({ error: 'Invalid query', details: e.flatten() });
      }
      return res.status(400).json({ error: 'Invalid query' });
    }
  };
}
