import express from 'express';
import {
  register,
  login,
  logout,
  currentUser,
} from '../controllers/authControllers.js';
import { validateBody } from '../helpers/validateBody.js';
import { schemas } from '../schemas/usersSchemas.js';
import { validateToken } from '../helpers/validateToken.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(schemas.registerSchema), register);

authRouter.post('/login', validateBody(schemas.registerSchema), login);

authRouter.post('/logout', validateToken, logout);

authRouter.get('/current', validateToken, currentUser);

export default authRouter;
