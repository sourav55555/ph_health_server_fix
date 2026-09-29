import { Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync, sendResponse } from "../../shared/catchAsync";
import status from "http-status";

const createDoctor = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await userService.createDoctor(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "create successful",
        data: result
    })
})
const createAdmin = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await userService.createAdmin(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "create successful",
        data: result
    })
})
const createSuperAdmin = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await userService.createSuperAdmin(payload);
    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "create successful",
        data: result
    })
})



export const userController = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}