import express from 'express';
import {
  register,
  login,
  logout,
  currentUser,
  upDateAvatar,
} from '../controllers/authControllers.js';
import { validateBody } from '../helpers/validateBody.js';
import { schemas } from '../schemas/usersSchemas.js';
import { validateToken } from '../helpers/validateToken.js';
import upload from '../middleWares/avatarUpLoad.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(schemas.registerSchema), register);

authRouter.post('/login', validateBody(schemas.registerSchema), login);

authRouter.post('/logout', validateToken, logout);

authRouter.get('/current', validateToken, currentUser);

authRouter.patch(
  '/avatars',
  validateToken,
  upload.single('avatar'),
  upDateAvatar
);

export default authRouter;
