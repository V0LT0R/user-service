import { prisma } from '../prisma/client.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signAccessToken } from '../utils/jwt.js';
import { Role } from '@prisma/client';

export async function registerUser(data: {
  fullName: string;
  birthDate: string; // ISO
  email: string;
  password: string;
}) {
  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      birthDate: new Date(data.birthDate),
      email: data.email.toLowerCase(),
      passwordHash,
      // Роль на регистрации всегда USER (не даем назначить ADMIN через API)
      role: 'USER'
    }
  });

  const token = signAccessToken({ sub: user.id, role: user.role as Role });
  return { user: sanitize(user), token };
}

export async function loginUser(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() }
  });
  if (!user) return null;

  if (!user.isActive) {
    return { blocked: true } as const;
  }

  const match = await comparePassword(data.password, user.passwordHash);
  if (!match) return null;

  const token = signAccessToken({ sub: user.id, role: user.role as Role });
  return { user: sanitize(user), token };
}

function sanitize(user: any) {
  // вырезаем passwordHash
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}
