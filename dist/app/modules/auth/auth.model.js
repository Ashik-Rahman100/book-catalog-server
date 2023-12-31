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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String },
    password: { type: String, required: true, select: 0 },
    wishList: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Book',
        },
    ],
}, { timestamps: true, toJSON: { virtuals: true }, versionKey: false });
// check user exist
userSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }, { _id: 1, email: 1, password: 1, role: 1 });
    });
};
// user match password
userSchema.statics.isMatchedPassword = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(givenPassword, savedPassword);
    });
};
// Hashed user password
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this;
        // Hash password
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// Handle validation conflict  | duplicate data handle or validation
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield exports.User.findOne({
            email: this.email,
            password: this.password,
        });
        if (isExist) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'User is already exist !');
        }
        next();
    });
});
exports.User = (0, mongoose_1.model)('User', userSchema);
