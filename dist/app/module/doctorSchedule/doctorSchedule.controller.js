"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../shared/catchAsync");
const doctorSchedule_service_1 = require("./doctorSchedule.service");
const createMyDoctorSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const doctorSchedule = await doctorSchedule_service_1.DoctorScheduleService.createDoctorSchedule(user, payload);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.CREATED,
        message: 'Doctor schedule created successfully',
        data: doctorSchedule
    });
});
const getMyDoctorSchedules = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const query = req.query;
    const result = await doctorSchedule_service_1.DoctorScheduleService.getMyDoctorSchedule(user, query);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Doctor schedules retrieved successfully',
        data: result.data,
        // meta: result.meta
    });
});
const getAllDoctorSchedules = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = req.query;
    const result = await doctorSchedule_service_1.DoctorScheduleService.getAllDoctorSchedule(query);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'All doctor schedules retrieved successfully',
        data: result.data,
        // meta: result.meta
    });
});
const getDoctorScheduleById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const doctorId = req.params.doctorId;
    const scheduleId = req.params.scheduleId;
    const result = await doctorSchedule_service_1.DoctorScheduleService.getDoctorScheduleById(doctorId, scheduleId);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Doctor schedule retrieved successfully',
        data: result
    });
});
const updateMyDoctorSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const updatedDoctorSchedule = await doctorSchedule_service_1.DoctorScheduleService.updateMyDoctorSchedule(user, payload);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Doctor schedule updated successfully',
        data: updatedDoctorSchedule
    });
});
const deleteMyDoctorSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    await doctorSchedule_service_1.DoctorScheduleService.deleteDoctorSchedule(id, user);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Doctor schedule deleted successfully',
    });
});
exports.DoctorScheduleController = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule
};
//# sourceMappingURL=doctorSchedule.controller.js.map