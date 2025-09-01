import { z } from 'zod';

export const userIdParamSchema = z.object({
  id: z.string().min(1)
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().positive().max(100).optional().default(10),
  isActive: z
    .enum(['true', 'false'])
    .optional()
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
