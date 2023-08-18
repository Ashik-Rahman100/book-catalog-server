"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookZodSchema = void 0;
const zod_1 = require("zod");
const book_constants_1 = require("./book.constants");
const createBookZodValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        author: zod_1.z.string({ required_error: 'Author is required' }),
        publishedAt: zod_1.z.string({ required_error: 'published date is required' }),
        genre: zod_1.z.enum([...book_constants_1.bookGenres], {
            required_error: 'Genre is required',
        }),
    }),
});
const updateBookZodValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().optional(),
        author: zod_1.z.string().optional(),
        publishedAt: zod_1.z.string().optional(),
        genre: zod_1.z.enum([...book_constants_1.bookGenres]).optional(),
    }),
});
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        reviewer: zod_1.z.string(),
        reviewText: zod_1.z.string(),
        rating: zod_1.z.number().optional(),
    }),
});
exports.BookZodSchema = {
    createBookZodValidationSchema,
    updateBookZodValidationSchema,
    createReviewZodSchema,
};
