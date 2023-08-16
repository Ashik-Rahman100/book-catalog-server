import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModel } from './auth.interface';

const userSchema = new Schema<IUser, UserModel>(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String },
    password: { type: String, required: true, select: 0 },
    wishList: { type: Schema.Types.ObjectId, ref: 'Book' },
  },
  { timestamps: true, toJSON: { virtuals: true }, versionKey: false },
);
// check user exist
userSchema.statics.isUserExist = async function (
  email: string,
): Promise<Pick<IUser, '_id' | 'email' | 'password' | 'role'> | null> {
  return await User.findOne(
    { email },
    { _id: 1, email: 1, password: 1, role: 1 },
  );
};
// user match password
userSchema.statics.isMatchedPassword = async function (
  givenPassword: string,
  savedPassword,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};
// Hashed user password
userSchema.pre('save', async function (next) {
  const user = this;
  // Hash password
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// Handle validation conflict  | duplicate data handle or validation
userSchema.pre('save', async function (next) {
  const isExist = await User.findOne({
    email: this.email,
    password: this.password,
  });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'User is already exist !');
  }
  next();
});

export const User = model<IUser, UserModel>('User', userSchema);
