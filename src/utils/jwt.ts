// src/utils/jwt.ts
import { sign, verify } from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { Role } from '@prisma/client';

type JWTPayload = { sub: string; role: Role };

export function signAccessToken(payload: JWTPayload) {
  return sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload {
  return verify(token, env.JWT_SECRET) as JWTPayload;
}
