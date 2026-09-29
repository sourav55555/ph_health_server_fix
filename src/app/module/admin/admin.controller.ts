import { Request, Response } from "express";
import { catchAsync, sendResponse } from "../../shared/catchAsync";

import { adminService } from "./admin.service";
import status from "http-status";

const getAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllAdmins();
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    })
})
const getAdminById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await adminService.getAdminById(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    })
})
const updateAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await adminService.updateAdmin(id as string, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    })
})
const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const result = await adminService.softDeleteAdmin(id as string, user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "delete successful"
    })
})

const changeUserStatus = catchAsync(
    async (req: Request, res: Response) => {
           const user = req.user;
        const payload = req.body
        const result = await adminService.changeStatus(user, payload);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User status changed successfully",
            data: result
        })
    }
)
const changeUserRole = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user;
        const payload = req.body
        const result = await adminService.changeUserRole(user, payload);
        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "User role changed successfully",
            data: result
        })
    }
)

export const adminController = {
    getAdmin,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    changeUserStatus,
    changeUserRole
}