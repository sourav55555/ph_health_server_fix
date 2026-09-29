"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentRoutes = void 0;
const express_1 = require("express");
const enums_1 = require("../../../generated/prisma/enums");
const checkAuth_1 = require("../../middleware/checkAuth");
const appointment_controller_1 = require("./appointment.controller");
const router = (0, express_1.Router)();
router.post("/book-appointment", (0, checkAuth_1.checkAuth)(enums_1.Role.PATIENT), appointment_controller_1.AppointmentController.bookAppointment);
router.get("/my-appointments", (0, checkAuth_1.checkAuth)(enums_1.Role.PATIENT, enums_1.Role.DOCTOR), appointment_controller_1.AppointmentController.getMyAppointments);
router.patch("/change-appointment-status/:id", (0, checkAuth_1.checkAuth)(enums_1.Role.PATIENT, enums_1.Role.DOCTOR, enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN), appointment_controller_1.AppointmentController.changeAppointmentStatus);
router.get("/my-single-appointment/:id", (0, checkAuth_1.checkAuth)(enums_1.Role.PATIENT, enums_1.Role.DOCTOR), appointment_controller_1.AppointmentController.getMySingleAppointment);
router.get("/all-appointments", (0, checkAuth_1.checkAuth)(enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN), appointment_controller_1.AppointmentController.getAllAppointments);
router.post("/book-appointment-with-pay-later", (0, checkAuth_1.checkAuth)(enums_1.Role.PATIENT), appointment_controller_1.AppointmentController.bookAppointmentWithPayLater);
router.post("/initiate-payment/:id", (0, checkAuth_1.checkAuth)(enums_1.Role.PATIENT), appointment_controller_1.AppointmentController.initiatePayment);
exports.AppointmentRoutes = router;
//# sourceMappingURL=appointment.route.js.map