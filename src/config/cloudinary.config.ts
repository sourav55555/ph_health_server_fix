import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";

cloudinary.config({
    cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY_API_SECRET
})

export const deleteFileFromCloudinary = async (url: string) => {
    try {
        const parsedUrl = new URL(url);
        const uploadPath = parsedUrl.pathname.split("/upload/")[1];

        if (!uploadPath) {
            throw new AppError(status.BAD_REQUEST, "invalid Cloudinary URL");
        }

        const pathWithoutVersion = uploadPath.replace(/^v\d+\//, "");
        const publicId = decodeURIComponent(pathWithoutVersion).replace(/\.[^/.]+$/, "");
        const resourceType = parsedUrl.pathname.match(/\/(image|raw|video)\/upload\//)?.[1] ?? "image";

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true
        });

        if (result.result !== "ok") {
            console.warn(`Cloudinary did not delete ${publicId}: ${result.result}`);
            return result;
        }

        console.log(`file ${publicId} deleted from cloudinary`);
        return result;
    } catch (err) {
        console.error(err);
        throw new AppError(status.INTERNAL_SERVER_ERROR, "failed to delete file from cloudinary")

    }
} 

export const uploadFileToCloudinary = async (
    buffer: Buffer,
    fileName: string,

): Promise<UploadApiResponse> => {
    if (!buffer || !fileName) {
        throw new AppError(status.BAD_REQUEST, "file buffer and fileName are required");
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

    return new Promise((resolve, reject)=> {
        cloudinary.uploader.upload_stream({
            resource_type: "auto",
            public_id: `ph-healthcare/${folder}/${uniqueName}`,
            folder: `ph-healthcare/${folder}`
        }, (error, result) => {
            if (error) {
                return reject(new AppError(status.INTERNAL_SERVER_ERROR, "failed to upload file"));
            }
            resolve(result as UploadApiResponse);
        }).end(buffer);
    });
}

export const cloudinaryUpload = cloudinary

