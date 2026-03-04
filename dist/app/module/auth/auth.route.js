"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.authController.registerPatient);
router.post("/login", auth_controller_1.authController.loginUser);
exports.AuthRoute = router;
//# sourceMappingURL=auth.route.js.map