"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const AppError_1 = __importDefault(require("../app/errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
dotenv_1.default.config();
const loadEnv = () => {
    const requiredVariables = [
        "NODE_ENV",
        "DATABASE_URL",
        "BETTER_AUTH_SECRET",
        "BETTER_AUTH_URL",
        "PORT",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "ACCESS_TOKEN_EXPIRES_IN",
        "REFRESH_TOKEN_EXPIRES_IN",
        "BETTER_AUTH_SESSION_TOKEN_EXPIRE_IN",
        "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
        "EMAIL_SENDER_SNTP_USER",
        "EMAIL_SENDER_SNTP_PASS",
        "EMAIL_SENDER_SNTP_HOST",
        "EMAIL_SENDER_SNTP_PORT",
        "EMAIL_SENDER_SNTP_FROM",
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'GOOGLE_CALLBACK_URL',
        'FRONTEND_URL',
        'CLOUDINARY_CLOUD_NAME',
        'CLOUDINARY_API_KEY',
        'CLOUDINARY_API_SECRET'
    ];
    requiredVariables.forEach((variable) => {
        if (!process.env[variable]) {
            // throw new Error(`Enviroment variable ${variable} is required`)
            throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, `Envthrow ironment variable ${variable} is required`);
        }
    });
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
        BETTER_AUTH_SESSION_TOKEN_EXPIRE_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRE_IN,
        BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
        EMAIL_SENDER_SNTP_USER: process.env.EMAIL_SENDER_SNTP_USER,
        EMAIL_SENDER_SNTP_PASS: process.env.EMAIL_SENDER_SNTP_PASS,
        EMAIL_SENDER_SNTP_HOST: process.env.EMAIL_SENDER_SNTP_HOST,
        EMAIL_SENDER_SNTP_PORT: process.env.EMAIL_SENDER_SNTP_PORT,
        EMAIL_SENDER_SNTP_FROM: process.env.EMAIL_SENDER_SNTP_FROM,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
        FRONTEND_URL: process.env.FRONTEND_URL,
        CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    };
};
exports.envVars = loadEnv();
//# sourceMappingURL=env.js.map