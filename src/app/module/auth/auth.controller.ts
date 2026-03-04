import { Request, Response } from "express";
import { catchAsync, sendResponse } from "../../shared/catchAsync";
import { authService } from "./auth.service";

const registerPatient = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authService.createPatient(payload);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "create successful",
        data: result
    })
})
const loginUser = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authService.loginUser(payload);
    sendResponse(res, {
        httpStatusCode: 201,
        success: true,
        message: "login successful",
        data: result
    })
})

export const authController = {
    registerPatient,
    loginUser
}