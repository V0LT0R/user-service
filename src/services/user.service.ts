import { prisma } from '../prisma/client.js';

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

export async function listUsers(params: { page: number; perPage: number; isActive?: boolean }) {
  const { page, perPage, isActive } = params;

  const where = typeof isActive === 'boolean' ? { isActive } : {};
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        fullName: true,
        birthDate: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })
  ]);

  return {
    page,
    perPage,
    total,
    data: users
  };
}

export async function blockUser(id: string) {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: false }
  });
  const { passwordHash, ...safe } = user;
  return safe;
}
