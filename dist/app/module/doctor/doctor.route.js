"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docRouter = void 0;
const express_1 = require("express");
const doctor_controller_1 = require("./doctor.controller");
const router = (0, express_1.Router)();
router.get("/", doctor_controller_1.doctorController.getDoc);
router.get("/:id", doctor_controller_1.doctorController.getDocById);
router.put("/:id", doctor_controller_1.doctorController.updateDoc);
router.delete("/:id", doctor_controller_1.doctorController.deleteDoc);
exports.docRouter = router;
//# sourceMappingURL=doctor.route.js.map