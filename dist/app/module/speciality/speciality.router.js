"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtyRouter = void 0;
const express_1 = require("express");
const speciality_controller_1 = require("./speciality.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const enums_1 = require("../../../generated/prisma/enums");
const multer_config_1 = require("../../../config/multer.config");
const validateRequest_1 = require("../../middleware/validateRequest");
const speciality_validation_1 = require("./speciality.validation");
const router = (0, express_1.Router)();
router.get("/", speciality_controller_1.specialtyController.getAllSpecialty);
router.post("/", 
// checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
multer_config_1.multerUpload.single("file"), (0, validateRequest_1.validateSchema)(speciality_validation_1.createSpecialtyZodSchema), speciality_controller_1.specialtyController.createSpecialty);
router.delete("/:id", (0, checkAuth_1.checkAuth)(enums_1.Role.ADMIN, enums_1.Role.SUPER_ADMIN), speciality_controller_1.specialtyController.deleteSpecialty);
router.put("/:id", speciality_controller_1.specialtyController.updateSpecialty);
exports.SpecialtyRouter = router;
//# sourceMappingURL=speciality.router.js.map