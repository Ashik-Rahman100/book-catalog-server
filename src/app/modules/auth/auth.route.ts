import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(AuthValidation.createUserZodSchema),
  AuthController.createUser
);
router.post(
  '/login',
  validateRequest(AuthValidation.createUserZodSchema),
  AuthController.loginUser
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken
);
router.get('/user/:id', AuthController.getSingleUser);
router.patch('/add-to-wish/:id', AuthController.addToWishList);
router.get('/wishList/:id', AuthController.getWishList);
router.patch('/remove-wish/:id', AuthController.removeWishList);

export const AuthRoutes = router;
