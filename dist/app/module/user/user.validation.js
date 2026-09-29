"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctorZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const enums_1 = require("../../../generated/prisma/enums");
exports.createDoctorZodSchema = zod_1.default.object({
    password: zod_1.default.string("password is required").min(6, "Password min 6 character").max(20, "password max 20 character "),
    doctor: zod_1.default.object({
        name: zod_1.default.string("Name is required").min(5, "Name min 5 character").max(30, "Name max 30 character"),
        email: zod_1.default.email("Email is required"),
        contactNumber: zod_1.default.string("Contact number is required").min(11, "Contact number min 11 character").max(14, "Contact number max 14 character"),
        address: zod_1.default.string("Address is required").min(10, "Address min 10 character").max(100, "Address max 100 character").optional(),
        registrationNumber: zod_1.default.string("Registration number is required"),
        experience: zod_1.default.int("Experience must be an integer").nonnegative("Experience must be a non-negative integer").optional(),
        gender: zod_1.default.enum([enums_1.Gender.MALE, enums_1.Gender.FEMALE], "Gender must be either male or female"),
        appointmentFee: zod_1.default.number("Appointment fee must be a number").nonnegative("Appointment fee must be a non-negative number"),
        qualification: zod_1.default.string("Qualification is required").min(5, "Qualification min 5 character").max(50, "Qualification max 50 character"),
        currentWorkingPlace: zod_1.default.string("Current working place is required").min(5, "Current working place min 5 character").max(50, "Current working place max 50 character"),
        designation: zod_1.default.string("Designation is required").min(5, "Designation min 5 character").max(50, "Designation max 50 character"),
    }),
    specialties: zod_1.default.array(zod_1.default.uuid("Specialty ID must be a valid UUID")).min(1, "At least one specialty ID is required")
});
//# sourceMappingURL=user.validation.js.map