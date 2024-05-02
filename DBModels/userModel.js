import mongoose from 'mongoose';

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

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash('md5').update(this.email).digest('hex');
    console.log(emailHash);

    this.avatar = `http://gravatar.com/avatar/${emailHash}.jpg?d=robohash`;
  }

  next();
});

export const User = mongoose.model('user', userSchema);
