import HttpError from './HttpError.js';
import jwt from 'jsonwebtoken';
import { User } from '../DBModels/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
export const validateToken = async (req, res, next) => {
  const { authorization = ' ' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  try {
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      throw new HttpError(401, { message: 'Not authorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, { message: 'Not authorized' }));
  }
  if (bearer !== 'Bearer') {
    console.log(bearer !== 'Bearer');
    throw new HttpError(401, { message: 'Not authorized' });
  }
};
