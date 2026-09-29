import status from "http-status";
import { catchAsync, sendResponse } from "../../shared/catchAsync";
import {Request, Response} from 'express'
import { statsService } from "./state.service";

const getDashboardStatsData = catchAsync(async (req: Request, res: Response) => {
    // const query = req.query;
    const user = req.user;
    const result = await statsService.getDashboardStatsData(user);
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        data: result,
        message: "Fetch successful"
    })
})

export const StatsController={
getDashboardStatsData}