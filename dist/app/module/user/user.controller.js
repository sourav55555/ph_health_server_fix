"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../shared/catchAsync");
const http_status_1 = __importDefault(require("http-status"));
const createDoctor = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await user_service_1.userService.createDoctor(payload);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.CREATED,
        success: true,
        message: "create successful",
        data: result
    });
});
const createAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await user_service_1.userService.createAdmin(payload);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.CREATED,
        success: true,
        message: "create successful",
        data: result
    });
});
const createSuperAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await user_service_1.userService.createSuperAdmin(payload);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.CREATED,
        success: true,
        message: "create successful",
        data: result
    });
});
exports.userController = {
    createDoctor,
    createAdmin,
    createSuperAdmin
};
//# sourceMappingURL=user.controller.js.map