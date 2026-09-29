"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const enums_1 = require("../../../generated/prisma/enums");
const router = (0, express_1.Router)();
router.get("/", (0, checkAuth_1.checkAuth)(enums_1.Role.SUPER_ADMIN), admin_controller_1.adminController.getAdmin);
router.get("/:id", (0, checkAuth_1.checkAuth)(enums_1.Role.SUPER_ADMIN), admin_controller_1.adminController.getAdminById);
// router.post("/create-admin", validateSchema() , adminController.createAdmin)
router.put("/:id", (0, checkAuth_1.checkAuth)(enums_1.Role.SUPER_ADMIN), admin_controller_1.adminController.updateAdmin);
router.delete("/:id", (0, checkAuth_1.checkAuth)(enums_1.Role.SUPER_ADMIN, enums_1.Role.ADMIN), admin_controller_1.adminController.deleteAdmin);
exports.adminRouter = router;
//# sourceMappingURL=admin.route.js.map