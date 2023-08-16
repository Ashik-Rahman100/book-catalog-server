import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
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
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  console.log(accessToken, refreshToken);
  return {
    accessToken,
    refreshToken,
  };
};
// get refresh Token
const refreshTokenService = async (
  token: string
): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    // invalid token
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
    // console.log(verifiedToken);
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
    { id: isUserExist._id, email: isUserExist?.email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createUserService,
  loginUserService,
  refreshTokenService,
};
