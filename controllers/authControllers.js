import { User } from '../DBModels/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import fs from 'fs/promises';
import gravatar from 'gravatar';
import path from 'path';
import jimp from 'jimp';
import crypto from 'crypto';
import { transport } from '../helpers/sendEmail.js';
import HttpError from '../helpers/HttpError.js';

const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL;

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, { message: 'Email in use' });
  }

  const verificationCode = crypto.randomUUID();
  const verifyEmail = {
    from: 'karinakramarenko_@ukr.net',
    to: email,
    subject: 'verify your email',
    text: `<a target="_blanc" href="${BASE_URL}/api/users/verify/${verificationCode}">Click verify email</a>`,
  };

  transport
    .sendMail(verifyEmail)
    .then(() => console.log('success'))
    .catch(error => next(error));

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken: verificationCode,
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

export const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, { message: 'Email not found' });
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: '',
  });
  throw HttpError(200, { message: 'Verification successful' });
};

export const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) throw HttpError(404, { message: 'Email not found' });

  if (user.verify)
    throw HttpError(400, { message: 'Verification has already been passed' });

  const verifyEmail = {
    from: 'karinakramarenko_@ukr.net',
    to: email,
    subject: 'verify your email',
    text: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  transport
    .sendEmail(verifyEmail)
    .then(() => console.log('success'))
    .catch(error => next(error));

  res.status(200).json({ message: 'Verification email sent' });
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user.verify) {
      res.status(404).json({ message: 'User not found' });
      throw HttpError(401, 'Email not verified');
    }

    if (!user)
      throw HttpError(401, { message: 'Email or password is incorrect' });
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
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const { id } = jwt.verify(token, JWT_SECRET);
    await User.findByIdAndUpdate(id, { token: null });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];

    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
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
