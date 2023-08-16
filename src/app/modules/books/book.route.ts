import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BookController } from './book.controller';
import { BookZodSchema } from './book.validation';

const router = express.Router();

router.post(
  '/add-book',
  validateRequest(BookZodSchema.createBookZodValidationSchema),
  BookController.addBook,
);
router.get('/:id', BookController.getSingleBook);
router.get('/', BookController.getAllBook);
router.patch(
  '/:id',
  validateRequest(BookZodSchema.updateBookZodValidationSchema),
  BookController.updateBook,
);
router.delete('/:id', BookController.deleteBook);

router.post(
  '/addReview/:id',
  validateRequest(BookZodSchema.createReviewZodSchema),
  BookController.addReview,
);
export const BookRoutes = router;
