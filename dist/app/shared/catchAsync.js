"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = exports.catchAsync = void 0;
const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        }
        catch (e) {
            next(e);
        }
    };
};
exports.catchAsync = catchAsync;
const sendResponse = (res, responseData) => {
    const { httpStatusCode, success, message, data } = responseData;
    res.status(httpStatusCode).json({
        success,
        message,
        data
    });
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=catchAsync.js.map