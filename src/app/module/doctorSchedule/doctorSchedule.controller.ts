import { Request, Response } from "express";
import status from "http-status";
import { IQueryParams } from "../../interfaces/query.interface";
import { catchAsync, sendResponse } from "../../shared/catchAsync";

import { DoctorScheduleService } from "./doctorSchedule.service";

const createMyDoctorSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const user = req.user;
    const doctorSchedule = await DoctorScheduleService.createDoctorSchedule(user, payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.CREATED,
        message: 'Doctor schedule created successfully',
        data: doctorSchedule
    });
});

const getMyDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const query = req.query;
    console.log(user, "user dataaa s doc")
    // console.log(user, query, "s doc")
    const result = await DoctorScheduleService.getMyDoctorSchedule(user, query as IQueryParams);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Doctor schedules retrieved successfully',
        data: result.data,
        // meta: result.meta
    });
});

const getAllDoctorSchedules = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result  = await DoctorScheduleService.getAllDoctorSchedule(query as IQueryParams);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'All doctor schedules retrieved successfully',
        data: result.data,
        // meta: result.meta
    });
});

const getDoctorScheduleById = catchAsync(async (req: Request, res: Response) => {
    const doctorId = req.params.doctorId;
    const scheduleId = req.params.scheduleId;
    const result = await DoctorScheduleService.getDoctorScheduleById(doctorId as string, scheduleId as string);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Doctor schedule retrieved successfully',
        data: result
    });
});

const updateMyDoctorSchedule = catchAsync( async (req : Request, res : Response) => {
    const payload = req.body;
    const user = req.user;
    const updatedDoctorSchedule = await DoctorScheduleService.updateMyDoctorSchedule(user, payload);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,  
        message: 'Doctor schedule updated successfully',
        data: updatedDoctorSchedule
    });
});

const deleteMyDoctorSchedule = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = req.user;
    await DoctorScheduleService.deleteDoctorSchedule(id as string, user);
    sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Doctor schedule deleted successfully',
    });
});


export const DoctorScheduleController = {
    createMyDoctorSchedule,
    getMyDoctorSchedules,
    getAllDoctorSchedules,
    getDoctorScheduleById,
    updateMyDoctorSchedule,
    deleteMyDoctorSchedule
}