import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../schemas/auth.schema.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

export default router;
