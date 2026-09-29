"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorController = void 0;
const catchAsync_1 = require("../../shared/catchAsync");
const http_status_1 = __importDefault(require("http-status"));
const doctor_service_1 = require("./doctor.service");
const getDoc = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = req.query;
    const result = await doctor_service_1.doctorService.getAllDoctors(query);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    });
});
const getDocById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await doctor_service_1.doctorService.getDocById(id);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    });
});
const updateDoc = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await doctor_service_1.doctorService.updateDoc(id, payload);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    });
});
const deleteDoc = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const result = await doctor_service_1.doctorService.deleteDoc(id);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    });
});
exports.doctorController = {
    getDoc,
    getDocById,
    updateDoc,
    deleteDoc
};
//# sourceMappingURL=doctor.controller.js.map