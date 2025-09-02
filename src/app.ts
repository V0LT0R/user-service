// src/app.ts  (CommonJS-сборка)

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/error';

export const app = express();

// security & basic middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// rate-limit только на /api/auth
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/auth', authLimiter);

// API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// статические страницы (главная и админка)
const publicDir = path.join(__dirname, '..', 'public');
app.use(express.static(publicDir));

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});
app.get('/admin', (_req, res) => {
  res.sendFile(path.join(publicDir, 'admin.html'));
});

// централизованный обработчик ошибок
app.use(errorHandler);
