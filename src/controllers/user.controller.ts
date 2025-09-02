import { Request, Response } from 'express';
import { blockUser, getUserById, listUsers } from '../services/user.service';

export async function getById(req: Request, res: Response) {
  const { id } = req.params;
  const user = await getUserById(id);
  if (!user) return res.status(404).json({ error: 'NotFound' });
  return res.json(user);
}

export async function getList(req: Request, res: Response) {
  // мягкий парсинг query
  const page = Math.max(1, Number(req.query.page ?? 1) || 1);
  const perPageRaw = Number(req.query.perPage ?? 10);
  const perPage = Math.min(100, Math.max(1, perPageRaw || 10));

  let isActive: boolean | undefined = undefined;
  if (typeof req.query.isActive !== 'undefined') {
    const v = String(req.query.isActive).toLowerCase();
    if (v === 'true') isActive = true;
    if (v === 'false') isActive = false;
  }

  const result = await listUsers({ page, perPage, isActive });
  return res.json(result);
}

export async function block(req: Request, res: Response) {
  const { id } = req.params;
  const user = await blockUser(id);
  return res.json(user);
}
