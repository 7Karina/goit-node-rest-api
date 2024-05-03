import { User } from '../DBModels/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import fs from 'fs/promises';
import gravatar from 'gravatar';
import path from 'path';
import jimp from 'jimp';
import HttpError from '../helpers/HttpError.js';
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (user) {
      throw HttpError(409, { message: 'Email in use' });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

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
      throw HttpError(401, { message: 'Email or password is incorrect' });
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

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.status(200).json({
      email: email,
      subscription: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const upDateAvatar = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      throw HttpError(400, { message: 'the request must contain a file' });
    }
    const tempDir = req.file.path;
    const publicDir = path.join(process.cwd(), `avatars/${fileName}`);
    const avatarDir = path.join('avatars', fileName);

    const image = await jimp.read(tempDir);
    await image.resize(250, 250).writeAsync(publicDir);

    const updateUser = User.findByIdAndUpdate(
      userId,
      { avatarURL: avatarDir },
      { new: true }
    );

    await fs.unlink(tempDir);

    res.status(200).json({ avatarURL: avatarDir });
  } catch (error) {
    next(error);
  }
};
