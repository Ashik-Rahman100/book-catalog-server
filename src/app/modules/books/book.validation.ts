import { z } from 'zod';
import { bookGenres } from './book.constants';

const createBookZodValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string().optional(),
    image: z.string().optional(),
    author: z.string({ required_error: 'Author is required' }),
    publishedAt: z.string({ required_error: 'published date is required' }),
    genre: z.enum([...bookGenres] as [string, ...string[]], {
      required_error: 'Genre is required',
    }),
  }),
});
const updateBookZodValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    author: z.string().optional(),
    publishedAt: z.string().optional(),
    genre: z.enum([...bookGenres] as [string, ...string[]]).optional(),
  }),
});

const createReviewZodSchema = z.object({
  body: z.object({
    reviewer: z.string(),
    reviewText: z.string(),
    rating: z.number().optional(),
  }),
});

export const BookZodSchema = {
  createBookZodValidationSchema,
  updateBookZodValidationSchema,
  createReviewZodSchema,
};
