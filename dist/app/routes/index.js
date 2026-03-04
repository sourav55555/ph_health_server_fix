"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexRouter = void 0;
const express_1 = require("express");
const speciality_router_js_1 = require("../module/speciality/speciality.router.js");
const auth_route_js_1 = require("../module/auth/auth.route.js");
const router = (0, express_1.Router)();
router.use("/specialty", speciality_router_js_1.SpecialtyRouter);
router.use("/auth", auth_route_js_1.AuthRoute);
exports.IndexRouter = router;
//# sourceMappingURL=index.js.map