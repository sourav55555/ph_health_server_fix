"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUpload = exports.uploadFileToCloudinary = exports.deleteFileFromCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
const AppError_1 = __importDefault(require("../app/errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
cloudinary_1.v2.config({
    cloud_name: env_1.envVars.CLOUDINARY_CLOUD_NAME,
    api_key: env_1.envVars.CLOUDINARY_API_KEY,
    api_secret: env_1.envVars.CLOUDINARY_API_SECRET
});
const deleteFileFromCloudinary = async (url) => {
    try {
        const match = url.match(/\/([^/]+)\.[^./]+$/);
        if (match && match[1]) {
            const publicId = match[1];
            await cloudinary_1.v2.uploader.destroy(publicId, {
                resource_type: "image"
            });
            console.log(`file ${publicId} deleted from cloudinary`);
        }
    }
    catch (err) {
        console.error(err);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "failed to delete file from cloudinary");
    }
};
exports.deleteFileFromCloudinary = deleteFileFromCloudinary;
const uploadFileToCloudinary = async (buffer, fileName) => {
    if (!buffer || !fileName) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "file buffer and fileName are required");
    }
    const extension = fileName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = fileName
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
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload_stream({
            resource_type: "auto",
            public_id: `ph-healthcare/${folder}/${uniqueName}`,
            folder: `ph-healthcare/${folder}`
        }, (error, result) => {
            if (error) {
                return reject(new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "failed to upload file"));
            }
            resolve(result);
        }).end(buffer);
    });
};
exports.uploadFileToCloudinary = uploadFileToCloudinary;
exports.cloudinaryUpload = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.config.js.map