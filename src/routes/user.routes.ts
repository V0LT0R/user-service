import { Router } from 'express';
import { getById, getList, block } from '../controllers/user.controller';
import { requireAuth, requireAdmin, requireAdminOrSelf } from '../middlewares/auth';
import { validateParams } from '../middlewares/validate';
import { userIdParamSchema } from '../schemas/user.schema';

const router = Router();

router.get('/:id',
  requireAuth,
  validateParams(userIdParamSchema),
  requireAdminOrSelf,
  getById
);

// ⬇️ без validateQuery – всё парсим в контроллере
router.get('/',
  requireAuth,
  requireAdmin,
  getList
);

router.patch('/:id/block',
  requireAuth,
  validateParams(userIdParamSchema),
  requireAdminOrSelf,
  block
);

export default router;
