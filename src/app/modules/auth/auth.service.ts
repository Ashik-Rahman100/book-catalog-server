import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IBook } from '../books/book.interface';
import { Book } from '../books/book.model';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from './auth.interface';
import { User } from './auth.model';

// create a user
const createUserService = async (payload: IUser): Promise<IUser> => {
  const result = await User.create(payload);
  return result;
};
// Login user
const loginUserService = async (
  payload: IUser
): Promise<ILoginUserResponse> => {
  const { email, password } = payload;
  // Chacked User
  const isExist = await User.isUserExist(email);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist.!');
  }
  // chacked match password
  const matchedPassword = await User.isMatchedPassword(
    password,
    isExist.password
  );
  if (!matchedPassword) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Incorrect Password.!');
  }

  // Get Accesss Token
  const accessToken = jwtHelpers.createToken(
    { _id: isExist?._id, email: isExist?.email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  // Get Refresh Token
  const refreshToken = jwtHelpers.createToken(
    { _id: isExist._id, email: isExist?.email },
    config.jwt.refresh_secret as Secret,
    config.jwt.expires_in as string
  );

  // console.log(accessToken, refreshToken);
  return {
    accessToken,
    refreshToken,
  };
};
// get refresh Token
const refreshTokenService = async (
  token: string
): Promise<IRefreshTokenResponse> => {
  // console.log(token);
  let verifiedToken = null;
  try {
    // invalid token
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token.');
  }
  const { email } = verifiedToken;
  // checking user refresh token
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exits.');
  }
  // generate new Access Token
  const newAccessToken = jwtHelpers.createToken(
    { _id: isUserExist?._id, email: isUserExist?.email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};
// Get single user by email
const getSingleUserService = async (email: string): Promise<IUser | null> => {
  const isExist = await User.findOne({ email }).exec();
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const result = await User.findOne({ email });
  return result;
};
// Add To Wish List
const addToWishListService = async (_id: string, book: IBook) => {
  const bookId = book._id;
  const isExist = await User.findById(_id).exec();
  const isBookExist = await Book.findById(bookId).exec();
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  if (!isBookExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found!');
  }

  const result = await User.findByIdAndUpdate(
    _id,
    {
      $push: { wishList: bookId },
    },
    { new: true }
  );
  return result;
};
const getWishListFromDB = async (_id: string) => {
  const result = await User.findById(_id)
    .select('wishList')
    .populate('wishList')
    .exec();
  if (!result) {
    // If the user is not found, return null
    return null;
  }

  return result; // Return the entire IUser object instead of just the wishList
};
const removeFromWishListInDB = async (_id: string, bookId: string) => {
  // console.log('bookid--------', bookId);
  const result = await User.findByIdAndUpdate(_id, {
    $pop: { wishList: bookId },
  }).exec();
  // console.log("result----------", result);
  return result;
};
export const AuthService = {
  createUserService,
  loginUserService,
  refreshTokenService,
  getSingleUserService,
  addToWishListService,
  getWishListFromDB,
  removeFromWishListInDB,
};
