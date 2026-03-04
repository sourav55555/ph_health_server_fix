"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = require("../../shared/catchAsync");
const auth_service_1 = require("./auth.service");
const registerPatient = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_1.authService.createPatient(payload);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: 201,
        success: true,
        message: "create successful",
        data: result
    });
});
const loginUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_1.authService.loginUser(payload);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: 201,
        success: true,
        message: "login successful",
        data: result
    });
});
exports.authController = {
    registerPatient,
    loginUser
};
//# sourceMappingURL=auth.controller.js.map