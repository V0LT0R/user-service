import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (err?.code === 'P2002') { // Prisma unique constraint
    return res.status(409).json({ error: 'Conflict', message: 'Email already exists' });
  }
  return res.status(500).json({ error: 'InternalServerError' });
}
