import { Router } from 'express';
import { getById, getList, block } from '../controllers/user.controller.js';
import { requireAuth, requireAdmin, requireAdminOrSelf } from '../middlewares/auth.js';
import { validateParams, validateQuery } from '../middlewares/validate.js';
import { userIdParamSchema } from '../schemas/user.schema.js';
import { listUsersQuerySchema } from '../schemas/user.schema.js';

const router = Router();

router.get('/:id',
  requireAuth,
  validateParams(userIdParamSchema),
  requireAdminOrSelf,
  getById
);

router.get('/',
  requireAuth,
  requireAdmin,
  validateQuery(listUsersQuerySchema),
  getList
);

router.patch('/:id/block',
  requireAuth,
  validateParams(userIdParamSchema),
  requireAdminOrSelf,
  block
);

export default router;
