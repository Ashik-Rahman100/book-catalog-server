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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const book_model_1 = require("../books/book.model");
const auth_model_1 = require("./auth.model");
// create a user
const createUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.create(payload);
    return result;
});
// Login user
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    // Chacked User
    const isExist = yield auth_model_1.User.isUserExist(email);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist.!');
    }
    // chacked match password
    const matchedPassword = yield auth_model_1.User.isMatchedPassword(password, isExist.password);
    if (!matchedPassword) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Incorrect Password.!');
    }
    // Get Accesss Token
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ _id: isExist === null || isExist === void 0 ? void 0 : isExist._id, email: isExist === null || isExist === void 0 ? void 0 : isExist.email }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // Get Refresh Token
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ _id: isExist._id, email: isExist === null || isExist === void 0 ? void 0 : isExist.email }, config_1.default.jwt.refresh_secret, config_1.default.jwt.expires_in);
    // console.log(accessToken, refreshToken);
    return {
        accessToken,
        refreshToken,
    };
});
// get refresh Token
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(token);
    let verifiedToken = null;
    try {
        // invalid token
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid refresh token.');
    }
    const { email } = verifiedToken;
    // checking user refresh token
    const isUserExist = yield auth_model_1.User.isUserExist(email);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exits.');
    }
    // generate new Access Token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ _id: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist._id, email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        accessToken: newAccessToken,
    };
});
// Get single user by email
const getSingleUserService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield auth_model_1.User.findOne({ email }).exec();
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    const result = yield auth_model_1.User.findOne({ email });
    return result;
});
// Add To Wish List
const addToWishListService = (_id, book) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = book._id;
    const isExist = yield auth_model_1.User.findById(_id).exec();
    const isBookExist = yield book_model_1.Book.findById(bookId).exec();
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (!isBookExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found!');
    }
    const result = yield auth_model_1.User.findByIdAndUpdate(_id, {
        $push: { wishList: bookId },
    }, { new: true });
    return result;
});
const getWishListFromDB = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findById(_id)
        .select('wishList')
        .populate('wishList')
        .exec();
    if (!result) {
        // If the user is not found, return null
        return null;
    }
    return result; // Return the entire IUser object instead of just the wishList
});
const removeFromWishListInDB = (_id, bookId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('bookid--------', bookId);
    const result = yield auth_model_1.User.findOneAndUpdate({ _id }, {
        $pull: { wishList: bookId },
    }, {
        new: true,
    }).exec();
    // console.log("result----------", result);
    return result;
});
exports.AuthService = {
    createUserService,
    loginUserService,
    refreshTokenService,
    getSingleUserService,
    addToWishListService,
    getWishListFromDB,
    removeFromWishListInDB,
};
