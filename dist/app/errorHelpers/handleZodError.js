"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodError = void 0;
const http_status_1 = __importDefault(require("http-status"));
const handleZodError = (err) => {
    const statusCode = http_status_1.default.BAD_REQUEST;
    const message = "Zod validation error";
    let errorSources = [];
    err.issues.forEach(issue => {
        errorSources.push({
            path: issue.path.join("") || "unknown",
            message: issue.message
        });
    });
    return {
        success: false,
        message,
        errorSources,
        statusCode
    };
};
exports.handleZodError = handleZodError;
//# sourceMappingURL=handleZodError.js.map