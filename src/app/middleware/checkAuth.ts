import {Request, Response, NextFunction } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";


export const checkAuth = (...authRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const sessionToken = cookieUtils.getCookie(req, "betterAuthSession");
        console.log(sessionToken, "s tok 1")

        if (!sessionToken) {
            throw new Error("Unauthorized access! no token provided.")
        }
        if (sessionToken) {
            const sessionExists = await prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    user: true
                }
            })
            console.log(sessionExists, "session 2")

            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user;
                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt)
                const createdAt = new Date(sessionExists.createdAt)
                console.log(user,authRoles, "session user")

                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const percentageRemaining = (timeRemaining / sessionLifeTime) * 100
                if (percentageRemaining < 20) {
                    res.setHeader("X-Session-Refresh", 'true');
                    res.setHeader("X-Session-Expires-At", expiresAt.toISOString())
                    res.setHeader("X-Time-Remaining", timeRemaining.toString())
                    
                    console.log("session expire soon")
                }
                if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
                    throw new AppError(status.UNAUTHORIZED, "unauthorized, user is not active")
                }
                if (user.isDeleted) {
                    
                    throw new AppError(status.UNAUTHORIZED, "unauthorized, user is deleted")
                    
                }
                if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                     throw new AppError(status.FORBIDDEN, "Forbidden access, you don't have permission to access this route")
                }
          
                req.user = {
                    userId: user.id,
                    role: user.role,
                    email: user.email
                }
                console.log(user, "user auth")
            }



        }
        // access token er kaj kote hobee

        const accessToken = cookieUtils.getCookie(req, "accessToken");
        if (!accessToken) {
            throw new AppError(status.UNAUTHORIZED, "Unauthorized! no access token provided")
        }
        const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET)
        if (!verifiedToken.success) {
            throw new AppError(status.UNAUTHORIZED, "unauthorized! Invalid access token")
        }

        // if (verifiedToken.data!.role !== 'ADMIN') {
        //     throw new AppError(status.FORBIDDEN, 'Forbidden access! You dont have permission to access this')
        // }
        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role)) {
            throw new AppError(status.FORBIDDEN, 'Forbidden access! You don\'t have permission to access this');
        }
        console.log("next working")
        next()

    } catch (error: any) {
        next(error)
    }
}