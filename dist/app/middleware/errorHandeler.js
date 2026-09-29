"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const env_1 = require("../../config/env");
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = __importDefault(require("zod"));
const handleZodError_1 = require("../errorHelpers/handleZodError");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const cloudinary_config_1 = require("../../config/cloudinary.config");
const globalErrorHandler = async (err, req, res, next) => {
    if (env_1.envVars.NODE_ENV === "development") {
        console.log("error from global error handler", err);
    }
    if (req.file) {
        await (0, cloudinary_config_1.deleteFileFromCloudinary)(req.file.path);
    }
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const imageUrls = req.files.map(file => file.path);
        await Promise.all(imageUrls.map(url => (0, cloudinary_config_1.deleteFileFromCloudinary)(url)));
    }
    let errorSources = [];
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let stack = undefined;
    if (err instanceof zod_1.default.ZodError) {
        const simplifiedError = (0, handleZodError_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = [...simplifiedError.errorSources];
        stack = err.stack;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [{
                path: "",
                message: err.message
            }];
    }
    else if (err instanceof Error) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = err.message;
        stack = err.stack;
    }
    if (err.statusCode && typeof err.statusCode === 'number') {
        statusCode = err.statusCode;
    }
    const errorRes = {
        success: false,
        message: message,
        errorSources,
        stack: env_1.envVars.NODE_ENV === "development" ? stack : undefined,
        error: env_1.envVars.NODE_ENV === "development" ? err : undefined,
    };
    res.status(statusCode).json(errorRes);
};
exports.globalErrorHandler = globalErrorHandler;
//# sourceMappingURL=errorHandeler.js.map