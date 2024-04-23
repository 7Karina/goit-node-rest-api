import express from 'express';
import {
  register,
  login,
  logout,
  currentUser,
} from '../controllers/authControllers.js';
import { validateBody } from '../helpers/validateBody.js';
import { registerSchema } from '../schemas/usersSchemas.js';
import { validateToken } from '../helpers/validateToken.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);

authRouter.post('/login', validateBody(registerSchema), login);

authRouter.post('/logout', validateToken, logout);

authRouter.get('/current', validateToken, currentUser);

export default authRouter;
