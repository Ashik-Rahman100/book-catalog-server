import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IBook } from '../books/book.interface';
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
// get user by email
const addToWishList = catchAsync(async (req: Request, res: Response) => {
  const _id = req?.params?.id;
  const book = req?.body?.book;
  const result = await AuthService.addToWishListService(_id, book);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single user successfully.',
    data: result,
  });
});
// Get wishlist
const getWishList = catchAsync(async (req: Request, res: Response) => {
  const userWishList = await AuthService.getWishListFromDB(req.params.id);

  if (userWishList === null) {
    sendResponse<IBook[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: [], // Return an empty array if the user has an empty wishlist
      message: 'User has an empty wishlist.',
    });
  } else {
    // Assuming wishList is an array of IBook objects in IUser interface

    // Convert userWishList to IBook[] using type assertion
    const wishListData = userWishList as unknown as IBook[];

    sendResponse<IBook[]>(res, {
      success: true,
      statusCode: httpStatus.OK,
      data: wishListData,
      message: 'Successfully retrieved wishlist 😎',
    });
  }
});
// delete wishlist
const removeWishList = catchAsync(async (req: Request, res: Response) => {
  const user = await AuthService.removeFromWishListInDB(
    req.params.id,
    req.body.bookId
  );
  sendResponse<IUser>(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: user,
    message: 'successfully removed from wishlist 😎',
  });
});
export const AuthController = {
  createUser,
  loginUser,
  refreshToken,
  getSingleUser,
  addToWishList,
  getWishList,
  removeWishList,
};
