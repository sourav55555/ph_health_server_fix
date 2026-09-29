"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const enums_1 = require("../../../generated/prisma/enums");
const validateRequest_1 = require("../../middleware/validateRequest");
const user_validation_1 = require("./user.validation");
const admin_validator_1 = require("../admin/admin.validator");
const checkAuth_1 = require("../../middleware/checkAuth");
const router = (0, express_1.Router)();
router.post("/create-doctor", (0, validateRequest_1.validateSchema)(user_validation_1.createDoctorZodSchema), user_controller_1.userController.createDoctor);
router.post("/create-admin", (0, checkAuth_1.checkAuth)(enums_1.Role.SUPER_ADMIN), (0, validateRequest_1.validateSchema)(admin_validator_1.createAdminZodSchema), user_controller_1.userController.createAdmin);
router.post("/create-super-admin", (0, validateRequest_1.validateSchema)(admin_validator_1.createAdminZodSchema), user_controller_1.userController.createSuperAdmin);
exports.UserRoutes = router;
//# sourceMappingURL=user.route.js.map