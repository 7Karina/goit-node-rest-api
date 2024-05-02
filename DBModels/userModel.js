import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: { type: String },
  },
  { versionKey: false }
);

export const User = mongoose.model('user', userSchema);
