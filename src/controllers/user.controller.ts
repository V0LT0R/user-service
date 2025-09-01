import { Request, Response } from 'express';
import { blockUser, getUserById, listUsers } from '../services/user.service.js';

export async function getById(req: Request, res: Response) {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) return res.status(404).json({ error: 'NotFound' });
  return res.json(user);
}

export async function getList(req: Request, res: Response) {
  const { page, perPage, isActive } = req.query as any;
  const parsedActive = typeof isActive === 'string' ? isActive === 'true' : undefined;

  const result = await listUsers({
    page: Number(page),
    perPage: Number(perPage),
    isActive: parsedActive
  });
  return res.json(result);
}

export async function block(req: Request, res: Response) {
  const { id } = req.params;
  // если сам себя блочит и это он – ок, если админ – тоже ок.
  const user = await blockUser(id);
  return res.json(user);
}
