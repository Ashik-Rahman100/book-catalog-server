"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const bookSchema = new mongoose_1.Schema({
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
}, { timestamps: true, versionKey: false });
// Data --> check ?
// Handle validation conflict  | duplicate data handle or validation
bookSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield exports.Book.findOne({
            title: this.title,
            author: this.author,
            genre: this.genre,
            description: this.description,
        });
        if (isExist) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Book is already exist !');
        }
        next();
    });
});
exports.Book = (0, mongoose_1.model)('Book', bookSchema);
