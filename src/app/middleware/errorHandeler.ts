import { NextFunction, Request,Response  } from "express";
import { envVars } from "../../config/env";
import status from "http-status";
import z from "zod";
import {TErrorResponse, TErrorSource } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";

import { deleteFileFromGlobalErrorHandler } from "../utils/deleteUploadedFilesFromGlobalErrorHandeler";
import { Prisma } from "../../generated/prisma/client";
import { handlePrismaClientInitializationError, handlePrismaClientKnownReqError, handlePrismaClientRustPanicError, handlePrismaClientUnknownReqError, handlePrismaClientValidationError } from "../errorHelpers/handlePrismaErrors";


export const globalErrorHandler = async (err: any, req: Request, res:Response, next: NextFunction) => {
    if (envVars.NODE_ENV === "development") {
        console.log("error from global error handler", err)
        
    }

    // if (req.file) {
    //     await deleteFileFromCloudinary(req.file.path)
    // }
    // if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    //     const imageUrls = req.files.map(file => file.path);
        
    
    //         await Promise.all(imageUrls.map(url => deleteFileFromCloudinary(url)))
    
    // }
    await deleteFileFromGlobalErrorHandler(req);

    let errorSources: TErrorSource[] = []
    let statusCode: number = status.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';
    let stack: string | undefined = undefined;

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = handlePrismaClientKnownReqError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        const simplifiedError = handlePrismaClientUnknownReqError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack
    }
    else if (err instanceof Prisma.PrismaClientValidationError) {
        const simplifiedError = handlePrismaClientValidationError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack
    }
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        const simplifiedError = handlePrismaClientRustPanicError();
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        const simplifiedError = handlePrismaClientInitializationError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack
    }
    else if (err instanceof z.ZodError) {
        const simplifiedError = handleZodError(err)

        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack
    } else if (err instanceof AppError) {
           statusCode = err.statusCode;
        message = err.message;
        stack = err.stack;
        errorSources = [{
            path: "",
            message: err.message
        }]
    }
    
    else if (err instanceof Error) {
        statusCode=status.INTERNAL_SERVER_ERROR;
        message = err.message;
        stack = err.stack
    }

    if (err.statusCode && typeof err.statusCode === 'number') {
        statusCode = err.statusCode;
    }

    const errorRes: TErrorResponse = {
            success: false,
            message: message,
            errorSources,
            stack: envVars.NODE_ENV === "development" ?  stack : undefined,
            error: envVars.NODE_ENV === "development" ?  err : undefined,
    }
    res.status(statusCode).json(errorRes)
}