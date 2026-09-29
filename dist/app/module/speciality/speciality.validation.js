"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpecialtyZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createSpecialtyZodSchema = zod_1.default.object({
    title: zod_1.default.string("title is required"),
    description: zod_1.default.string("description is required").optional()
});
//# sourceMappingURL=speciality.validation.js.map