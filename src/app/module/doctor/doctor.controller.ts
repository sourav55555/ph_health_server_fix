import { Request, Response } from "express";
import { catchAsync, sendResponse } from "../../shared/catchAsync";

import status from "http-status";
import { doctorService } from "./doctor.service";
import { IQueryParams } from "../../interfaces/query.interface";

const getDoc = catchAsync(async (req: Request, res: Response) => {
    const query = req.query
    const result = await doctorService.getAllDoctors(query as IQueryParams);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    })
})
const getDocById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await doctorService.getDocById(id as string);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    })
})
const updateDoc = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await doctorService.updateDoc(id as string, payload);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    })
})

const deleteDoc = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await doctorService.deleteDoc(id as string)
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    })
})

export const doctorController = {
    getDoc,
    getDocById,
    updateDoc,
    deleteDoc
}