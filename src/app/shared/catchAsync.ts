import { NextFunction, RequestHandler, Request,Response  } from "express"

export const catchAsync = (fn: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            fn(req,res,next)
        } catch (e: any) {
        res.status(500).json({
            success: false,
            message: "fetch failed",
            error: e.message
        })
    }
    }
}


interface IResponseData<T>{
    httpStatusCode: number;
    success: boolean;
    message: string;
    data?: T
}

export const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
    const { httpStatusCode, success, message, data } = responseData;
    res.status(httpStatusCode).json({
        success,
        message,
        data
    })
}