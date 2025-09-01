import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { Role } from '@prisma/client';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.substring('Bearer '.length);
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== Role.ADMIN) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

/**
 * Доступ: админ ИЛИ сам пользователь (по :id)
 */
export function requireAdminOrSelf(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  const targetId = req.params.id;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (user.role === Role.ADMIN || user.id === targetId) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' });
}
