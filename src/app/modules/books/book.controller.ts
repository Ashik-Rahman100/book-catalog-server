import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { bookFilterableFields } from './book.constants';
import { IBook } from './book.interface';
import { BookService } from './book.service';

// Get single Book
const addBook = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await BookService.addBookService(data);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book create successfully.',
    data: result,
  });
});
// Get single Book
const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BookService.getSingleBookService(id);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Book retrive successfully.',
    data: result,
  });
});
// Get All Book controller
const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, paginationFields);
  const filters = pick(req.query, bookFilterableFields);
  const result = await BookService.getAllBookService(
    filters,
    paginationOptions,
  );
  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book retrive successfully.',
    meta: result.meta,
    data: result.data,
  });
});
// update Book controller
const updateBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await BookService.updateBookService(id, updatedData);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book updated successfully.',
    data: result,
  });
});
// delete single Book
const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await BookService.deleteBookservice(id);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Book deleted successfully.',
    data: result,
  });
});

// Get single Book
const addReview = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.addReviewService(req.params.id, req.body);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review create successfully.',
    data: result,
  });
});

export const BookController = {
  addBook,
  getSingleBook,
  getAllBook,
  updateBook,
  deleteBook,
  addReview,
};
