import mongoose, { Model } from 'mongoose';

export type BookGenre =
  | 'Fiction'
  | 'Non-Fiction'
  | 'Science Fiction'
  | 'Fantasy'
  | 'Mystery'
  | 'Romance'
  | 'Thriller'
  | 'Horror'
  | 'Adventure'
  | 'Historical Fiction'
  | 'Biography'
  | 'Self-Help'
  | 'Poetry'
  | 'Cookbook'
  | 'Graphic Novel'
  | 'Young Adult';

export type IReview = {
  rating: number;
  reviewText: string;
  reviewer: mongoose.Schema.Types.ObjectId;
};

export type IBook = {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  description?: string;
  image?: string;
  reviews?: IReview[];
  author: string;
  publishedAt: string;
  genre: BookGenre;
};

export type BookModel = Model<IBook, Record<string, unknown>>;

export type IBookFilters = {
  searchTerm?: string;
  author?: string;
  genre?: string;
  title?: string;
  publisedAt?: string;
};
