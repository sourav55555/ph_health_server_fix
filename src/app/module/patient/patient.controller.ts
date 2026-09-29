import { IRequestUser } from "../../interfaces/requestUser.interface";
import { catchAsync, sendResponse } from "../../shared/catchAsync";
import {Request, Response} from 'express'
import { patientService } from "./patient.service";
import status from "http-status";

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const payload = req.body

    const result = await patientService.updateMyProfile(user, payload);

    sendResponse(res, {
        httpStatusCode: status.OK,
        message: "profile update successful",
        success: true,
        data: result
    })

})


export const patientController = {
    updateMyProfile
}