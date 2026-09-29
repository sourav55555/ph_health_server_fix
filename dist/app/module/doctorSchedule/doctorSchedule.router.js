"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleRoutes = void 0;
const express_1 = require("express");
const enums_1 = require("../../../generated/prisma/enums");
const checkAuth_1 = require("../../middleware/checkAuth");
const doctorSchedule_controller_1 = require("./doctorSchedule.controller");
const router = (0, express_1.Router)();
router.post("/create-my-doctor-schedule", (0, checkAuth_1.checkAuth)(enums_1.Role.DOCTOR), doctorSchedule_controller_1.DoctorScheduleController.createMyDoctorSchedule);
router.get("/my-doctor-schedules", (0, checkAuth_1.checkAuth)(enums_1.Role.DOCTOR), doctorSchedule_controller_1.DoctorScheduleController.getMyDoctorSchedules);
router.get("/", (0, checkAuth_1.checkAuth)(enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN), doctorSchedule_controller_1.DoctorScheduleController.getAllDoctorSchedules);
router.get("/:doctorId/schedule/:scheduleId", (0, checkAuth_1.checkAuth)(enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN), doctorSchedule_controller_1.DoctorScheduleController.getDoctorScheduleById);
router.patch("/update-my-doctor-schedule", (0, checkAuth_1.checkAuth)(enums_1.Role.DOCTOR), doctorSchedule_controller_1.DoctorScheduleController.updateMyDoctorSchedule);
router.delete("/delete-my-doctor-schedule/:id", (0, checkAuth_1.checkAuth)(enums_1.Role.DOCTOR), doctorSchedule_controller_1.DoctorScheduleController.deleteMyDoctorSchedule);
exports.DoctorScheduleRoutes = router;
//# sourceMappingURL=doctorSchedule.router.js.map