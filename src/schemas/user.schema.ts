import { z } from 'zod';

// аккуратно парсим page/perPage из строки; пустые -> дефолты
const pageSchema = z.preprocess(
  (v) => (v === undefined || v === '' ? 1 : Number(v)),
  z.number().int().min(1)
);

const perPageSchema = z.preprocess(
  (v) => (v === undefined || v === '' ? 10 : Number(v)),
  z.number().int().min(1).max(100)
);

export const listUsersQuerySchema = z.object({
  page: pageSchema,
  perPage: perPageSchema,
  // true/false как строка -> boolean | undefined
  isActive: z
    .preprocess((v) => (v === undefined || v === '' ? undefined : String(v) === 'true'), z.boolean().optional())
    .optional()
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

export const userIdParamSchema = z.object({
  id: z.string().min(1)
});
