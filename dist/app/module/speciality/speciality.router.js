"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialtyRouter = void 0;
const express_1 = require("express");
const speciality_controller_1 = require("./speciality.controller");
const router = (0, express_1.Router)();
router.get("/", speciality_controller_1.specialtyController.getAllSpecialty);
router.post("/", speciality_controller_1.specialtyController.createSpecialty);
router.delete("/:id", speciality_controller_1.specialtyController.deleteSpecialty);
router.put("/:id", speciality_controller_1.specialtyController.updateSpecialty);
exports.SpecialtyRouter = router;
//# sourceMappingURL=speciality.router.js.map