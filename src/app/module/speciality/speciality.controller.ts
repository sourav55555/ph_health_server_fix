import type { NextFunction, Request, RequestHandler, Response } from "express";
import { specialtyService } from "./speciality.service";
import { catchAsync, sendResponse } from "../../shared/catchAsync";



const createSpecialty = catchAsync(
    async (req: Request, res: Response) => {
        const payload = { ...req.body, icon: req.file?.path };
        console.log(payload, "payload")
    
        const response = await specialtyService.createSpecialty(payload);

        res.status(201).json({
            success: true,
            message: "create successful",
            data: response
        })
    }
)

const getAllSpecialty = catchAsync(
    async (req: Request, res: Response) => {
         const response = await specialtyService.getAllSpecialty();

        sendResponse(res, {
            httpStatusCode: 201,
            success: true,
            message: "fetch success",
            data: response
        })
    }
)



const deleteSpecialty = catchAsync(
     async (req: Request, res: Response) => {
       const { id } = req.params
        const response = await specialtyService.deleteSpecialty(id as string);

        res.status(201).json({
            success: true,
            message: "delete successful",
            data: response
        })
    }
)


const updateSpecialty = catchAsync(
    async (req: Request, res: Response) => { 
         const { id } = req.params;
        const payload = req.body;
        const response = await specialtyService.updateSpecialty(id as string, payload);

        res.status(201).json({
            success: true,
            message: "delete successful",
            data: response
        })
    }
)

export const specialtyController = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty,
    updateSpecialty
}