import httpStatus from 'http-status';
import { Schema, model } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { BookModel, IBook } from './book.interface';

const bookSchema = new Schema<IBook, BookModel>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: true },
    reviews: {
      type: [
        {
          reviewer: {
            type: String,
            required: true,
          },
          reviewText: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
          },
        },
      ],
    },
    author: { type: String, required: true },
    publishedAt: { type: String, required: true },
    genre: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

// Data --> check ?
// Handle validation conflict  | duplicate data handle or validation
bookSchema.pre('save', async function (next) {
  const isExist = await Book.findOne({
    title: this.title,
    author: this.author,
    genre: this.genre,
    description: this.description,
  });
  if (isExist) {
    throw new ApiError(httpStatus.CONFLICT, 'Book is already exist !');
  }
  next();
});

export const Book = model<IBook, BookModel>('Book', bookSchema);
