"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = void 0;
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_config_1 = require("./cloudinary.config");
const multer_1 = __importDefault(require("multer"));
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_config_1.cloudinaryUpload,
    params: async (req, file) => {
        const originalName = file.originalname;
        const extension = originalName.split(".").pop()?.toLocaleLowerCase();
        const fileNameWithoutExtension = originalName
            .split(".")
            .slice(0, -1)
            .join(".")
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9\-]/g, "");
        const uniqueName = Math.random().toString(36).substring(2) +
            "-" +
            Date.now() +
            "-" +
            fileNameWithoutExtension;
        const folder = extension === "pdf" ? "pdfs" : "images";
        return {
            folder: `ph-healthcare/${folder}`,
            public_id: uniqueName,
            resource_type: "auto"
        };
    }
});
exports.multerUpload = (0, multer_1.default)({ storage });
//# sourceMappingURL=multer.config.js.map