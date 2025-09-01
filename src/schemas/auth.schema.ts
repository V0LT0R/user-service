import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(3).max(200),
  birthDate: z.string().refine((d) => !Number.isNaN(Date.parse(d)), 'Invalid date'),
  email: z.string().email(),
  password: z.string().min(8).max(200)
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export type LoginInput = z.infer<typeof loginSchema>;
