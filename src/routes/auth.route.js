import { Router } from 'express';
import { registerUser } from '../controllers/auth.controllers.js';
import { userRegisterValidator } from '../validators/index.js';
import { validateRequest } from '../middlewares/validator.middleware.js';

const router = Router();

router.post(
  '/register',
  userRegisterValidator(),
  validateRequest,
  registerUser,
);
export default router;
