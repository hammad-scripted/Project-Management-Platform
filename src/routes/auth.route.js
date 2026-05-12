import { Router } from 'express';
import { login, registerUser } from '../controllers/auth.controllers.js';
import { userRegisterValidator } from '../validators/index.js';
import { validateRequest } from '../middlewares/validator.middleware.js';

const router = Router();

router.post(
  '/register',
  userRegisterValidator(),
  validateRequest,
  registerUser,
);
router.post('/login', login);
export default router;
