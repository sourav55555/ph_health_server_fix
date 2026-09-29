"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../shared/catchAsync");
const appointment_service_1 = require("./appointment.service");
const bookAppointment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const appointment = await appointment_service_1.AppointmentService.bookAppointment(payload, user);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.CREATED,
        message: 'Appointment booked successfully',
        data: appointment
    });
});
const getMyAppointments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const appointments = await appointment_service_1.AppointmentService.getMyAppointments(user);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Appointments retrieved successfully',
        data: appointments
    });
});
const changeAppointmentStatus = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const appointmentId = req.params.id;
    const payload = req.body;
    const user = req.user;
    const updatedAppointment = await appointment_service_1.AppointmentService.changeAppointmentStatus(appointmentId, payload, user);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Appointment status updated successfully',
        data: updatedAppointment
    });
});
const getMySingleAppointment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const appointmentId = req.params.id;
    const user = req.user;
    const appointment = await appointment_service_1.AppointmentService.getMySingleAppointment(appointmentId, user);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Appointment retrieved successfully',
        data: appointment
    });
});
const getAllAppointments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const appointments = await appointment_service_1.AppointmentService.getAllAppointments();
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'All appointments retrieved successfully',
        data: appointments
    });
});
const bookAppointmentWithPayLater = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const appointment = await appointment_service_1.AppointmentService.bookAppointmentWithPayLater(payload, user);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.CREATED,
        message: 'Appointment booked successfully with Pay Later option',
        data: appointment
    });
});
const initiatePayment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const appointmentId = req.params.id;
    const user = req.user;
    const paymentInfo = await appointment_service_1.AppointmentService.initiatePayment(appointmentId, user);
    (0, catchAsync_1.sendResponse)(res, {
        success: true,
        httpStatusCode: http_status_1.default.OK,
        message: 'Payment initiated successfully',
        data: paymentInfo
    });
});
exports.AppointmentController = {
    bookAppointment,
    getMyAppointments,
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
};
//# sourceMappingURL=appointment.controller.js.map