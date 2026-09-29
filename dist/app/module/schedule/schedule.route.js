"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleRoutes = void 0;
const express_1 = require("express");
const enums_1 = require("../../../generated/prisma/enums");
const checkAuth_1 = require("../../middleware/checkAuth");
const schedule_controller_1 = require("./schedule.controller");
const validateRequest_1 = require("../../middleware/validateRequest");
const schedule_validation_1 = require("./schedule.validation");
const router = (0, express_1.Router)();
router.post('/', (0, checkAuth_1.checkAuth)(enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateSchema)(schedule_validation_1.ScheduleValidation.createScheduleZodSchema), schedule_controller_1.ScheduleController.createSchedule);
router.get('/', (0, checkAuth_1.checkAuth)(enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN, enums_1.Role.DOCTOR), schedule_controller_1.ScheduleController.getAllSchedules);
router.get('/:id', (0, checkAuth_1.checkAuth)(enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN, enums_1.Role.DOCTOR), schedule_controller_1.ScheduleController.getScheduleById);
router.patch('/:id', (0, checkAuth_1.checkAuth)(enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateSchema)(schedule_validation_1.ScheduleValidation.updateScheduleZodSchema), schedule_controller_1.ScheduleController.updateSchedule);
router.delete('/:id', (0, checkAuth_1.checkAuth)(enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN), schedule_controller_1.ScheduleController.deleteSchedule);
exports.scheduleRoutes = router;
//# sourceMappingURL=schedule.route.js.map