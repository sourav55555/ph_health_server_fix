"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminZodSchema = exports.updateDoctorZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.updateDoctorZodSchema = zod_1.default.object({}).partial();
exports.createAdminZodSchema = zod_1.default.object({
    password: zod_1.default.string("password is required").min(8, "password min 8 character"),
    admin: zod_1.default.object({
        name: zod_1.default.string("Name is required").min(3, "name min 3 character"),
        email: zod_1.default.email("Email is required"),
        contactNumber: zod_1.default.string("Contact number is required").min(11, "Min 11 character").max(14, "max 14 character"),
        profilePhoto: zod_1.default.string().optional()
    }),
});
//# sourceMappingURL=admin.validator.js.map