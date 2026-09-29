"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleValidation = void 0;
const zod_1 = __importDefault(require("zod"));
const createScheduleZodSchema = zod_1.default.object({
    startDate: zod_1.default.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    endDate: zod_1.default.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    startTime: zod_1.default.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message: "Invalid time format",
    }),
    endTime: zod_1.default.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message: "Invalid time format",
    }),
});
const updateScheduleZodSchema = zod_1.default.object({
    startDate: zod_1.default.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional(),
    endDate: zod_1.default.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional(),
    startTime: zod_1.default.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message: "Invalid time format",
    }).optional(),
    endTime: zod_1.default.string().refine((time) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
        message: "Invalid time format",
    }).optional(),
});
exports.ScheduleValidation = {
    createScheduleZodSchema,
    updateScheduleZodSchema
};
//# sourceMappingURL=schedule.validation.js.map