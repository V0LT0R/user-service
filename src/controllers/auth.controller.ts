import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service.js';

export async function register(req: Request, res: Response) {
  const { user, token } = await registerUser(req.body);
  return res.status(201).json({ user, token });
}

export async function login(req: Request, res: Response) {
  const result = await loginUser(req.body);
  if (!result) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if ('blocked' in result) {
    return res.status(403).json({ error: 'User is blocked' });
  }
  return res.json(result);
}
