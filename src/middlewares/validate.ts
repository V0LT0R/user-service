// src/middlewares/validate.ts
import { ZodSchema, ZodTypeAny, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

// тело
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

// params (обычно объект)
export function validateParams(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (e) {
      return res.status(400).json({ error: 'Invalid params' });
    }
  };
}

// query (строки → можно парсить через z.coerce)
export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (e) {
      return res.status(400).json({ error: 'Invalid query' });
    }
  };
}
