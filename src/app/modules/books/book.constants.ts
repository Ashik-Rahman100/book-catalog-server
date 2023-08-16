import { BookGenre } from './book.interface';

export const bookGenres: BookGenre[] = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Romance',
  'Thriller',
  'Horror',
  'Adventure',
  'Historical Fiction',
  'Biography',
  'Self-Help',
  'Poetry',
  'Cookbook',
  'Graphic Novel',
  'Young Adult',
];

export const bookSearchableFields = ['author', 'genre', 'title', 'publisedAt'];
export const bookFilterableFields = [
  'searchTerm',
  'author',
  'genre',
  'title',
  'publisedAt',
];
