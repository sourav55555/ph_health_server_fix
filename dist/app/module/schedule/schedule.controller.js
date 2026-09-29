"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../shared/catchAsync");
const schedule_service_1 = require("./schedule.service");
const createSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const schedule = await schedule_service_1.ScheduleService.createSchedule(payload);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.CREATED,
        message: 'Schedule created successfully',
        data: schedule
    });
});
const getAllSchedules = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const query = req.query;
    const result = await schedule_service_1.ScheduleService.getAllSchedules(query);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Schedules retrieved successfully',
        data: result.data,
        meta: result.meta
    });
});
const getScheduleById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const schedule = await schedule_service_1.ScheduleService.getScheduleById(id);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Schedule retrieved successfully',
        data: schedule
    });
});
const updateSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const updatedSchedule = await schedule_service_1.ScheduleService.updateSchedule(id, payload);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Schedule updated successfully',
        data: updatedSchedule
    });
});
const deleteSchedule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await schedule_service_1.ScheduleService.deleteSchedule(id);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Schedule deleted successfully',
    });
});
exports.ScheduleController = {
    createSchedule,
    getAllSchedules,
    getScheduleById,
    updateSchedule,
    deleteSchedule
};
//# sourceMappingURL=schedule.controller.js.map