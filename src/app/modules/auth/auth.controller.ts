import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import {
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from './auth.interface';
import { AuthService } from './auth.service';

// create signup
const createUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AuthService.createUserService(data);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user create successfully.',
    data: result,
  });
});
// login signup
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUserService(loginData);
  const { refreshToken, ...otherData } = result;
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user login successfully.',
    data: otherData,
  });
});
// refresh token handler
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshTokenService(refreshToken);

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'user login successfully.',
    data: result,
  });
});
// get user by email
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.getSingleUserService(req.params?.id);
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single user successfully.',
    data: result,
  });
});
export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
  getSingleUser,
};
