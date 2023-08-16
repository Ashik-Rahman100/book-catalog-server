import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IGenericResponse } from '../../../interface/common';
import { IPaginationOptions } from '../../../interface/pagination';
import { bookSearchableFields } from './book.constants';
import { IBook, IBookFilters, IReview } from './book.interface';
import { Book } from './book.model';

// create a book semester
const addBookService = async (payload: IBook): Promise<IBook> => {
  const result = await Book.create(payload);
  return result;
};
// Get Single Book
const getSingleBookService = async (_id: string): Promise<IBook | null> => {
  const isExist = await Book.findById(_id).exec();
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  const result = await Book.findById(_id);
  return result;
};
// Get all Book Service
const getAllBookService = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBook[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];
  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  // Dynamic Filters Data
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  // Dynamic  Sort needs  field to  do sorting
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await Book.find(whereConditions)
    .populate('reviews')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
// Get Single Book
const updateBookService = async (
  _id: string,
  payload: Partial<IBook>
): Promise<IBook | null> => {
  const isExist = await Book.findById(_id).exec();
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book not found !');
  }
  const result = await Book.findByIdAndUpdate(_id, payload, { new: true });
  return result;
};
// Delete Book
const deleteBookservice = async (_id: string): Promise<IBook | null> => {
  const isExist = await Book.findById(_id).exec();
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book Not Found');
  }
  const result = await Book.findByIdAndDelete(_id).exec();
  return result;
};

// creat book review
const addReviewService = async (
  _id: string,
  review: IReview
): Promise<IBook | null> => {
  const isExist = await Book.findById(_id).exec();
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Book Not Found.');
  }
  const result = await Book.findByIdAndUpdate(
    _id,
    {
      $push: { reviews: review },
    },
    { new: true }
  ).exec();
  return result;
};

export const BookService = {
  addBookService,
  getSingleBookService,
  getAllBookService,
  updateBookService,
  deleteBookservice,
  addReviewService,
};
