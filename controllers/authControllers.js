import { User } from '../DBModels/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import HttpError from '../helpers/HttpError.js';
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (user) {
      throw new HttpError(409, { message: 'Email in use' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Email or password is incorrect' });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      res.status(401).json({ message: 'Email or password is incorrect' });
    }
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { id } = req.user;
    await User.findByIdAndUpdate(id, { token: null });

    throw new HttpError(204);
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    throw new HttpError(200, { email, subscription });
  } catch (error) {
    next(error);
  }
};
