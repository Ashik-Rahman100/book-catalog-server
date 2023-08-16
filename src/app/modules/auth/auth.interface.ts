/* eslint-disable no-unused-vars */
import mongoose, { Model } from 'mongoose';
import { IBook } from '../books/book.interface';

export type IRefreshTokenResponse = {
  accessToken: string;
};
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};
export type IUser = {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  role?: string;
  password: string;
  wishList?: IBook[];
};

export type UserModel = {
  isUserExist(
    email: string,
  ): Promise<Pick<IUser, '_id' | 'password' | 'email' | 'role'> | null>;
  isMatchedPassword(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
} & Model<IUser>;
