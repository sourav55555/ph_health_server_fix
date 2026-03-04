"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = exports.catchAsync = void 0;
const catchAsync = (fn) => {
    return async (req, res, next) => {
        try {
            fn(req, res, next);
        }
        catch (e) {
            res.status(500).json({
                success: false,
                message: "fetch failed",
                error: e.message
            });
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