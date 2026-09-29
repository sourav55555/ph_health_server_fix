"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const catchAsync_1 = require("../../shared/catchAsync");
const admin_service_1 = require("./admin.service");
const http_status_1 = __importDefault(require("http-status"));
const getAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await admin_service_1.adminService.getAllAdmins();
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    });
});
const getAdminById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await admin_service_1.adminService.getAdminById(id);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    });
});
const updateAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await admin_service_1.adminService.updateAdmin(id, payload);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    });
});
const deleteAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await admin_service_1.adminService.softDeleteAdmin(id, user);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "delete successful"
    });
});
exports.adminController = {
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin
};
//# sourceMappingURL=admin.controller.js.map