import { Request, Response } from "express";
import { catchAsync, sendResponse } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { cookieUtils } from "../../utils/cookie";
import { envVars } from "../../../config/env";
import { auth } from "../../lib/auth";

const registerPatient = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authService.createPatient(payload);
    const { accessToken, refreshToken, token, ...rest } = result

    tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie(res, refreshToken)
    tokenUtils.setBatterAuthSessionCookie(res, token as string)

    sendResponse(res, {
        httpStatusCode: status.CREATED,
        success: true,
        message: "create successful",
          data: {
            token,
            accessToken,
            refreshToken,
            ...rest
        }
    })
})
const loginUser = catchAsync( async (req: Request, res: Response) => {
    const payload = req.body;
    const result = await authService.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result
    tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie(res, refreshToken)
    tokenUtils.setBatterAuthSessionCookie(res, token)
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "login successful",
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest
        }
    })
})

const getMe = catchAsync( async (req: Request, res: Response) => {
    const user = req.user;
    const result = await authService.getMe(user)
    
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "login successful",
        data: result
    })
})

const getNewToken = catchAsync(async (req: Request, res: Response) => { 
    console.log(req.cookies, "cookieee")
    const betterAuthRefreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies.betterAuthSession
    if (!betterAuthRefreshToken) {
        throw new AppError(status.UNAUTHORIZED, "no refresh token available")
    }
      const result = await authService.getNewToken(betterAuthRefreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken, sessionToken, ...rest } = result
    tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie(res, refreshToken)
    tokenUtils.setBatterAuthSessionCookie(res, sessionToken)
    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "token refresh successful",
        data: {
            sessionToken,
            accessToken,
            refreshToken,
      
        }
    })

})

const changePassword = catchAsync(async (req: Request, res: Response) => { 
    const payload = req.body;
    console.log(payload, "payload")
    const betterAuthSessionToken = req.cookies["betterAuthSession"]

    const result = await authService.changePassword(payload, betterAuthSessionToken);

    const { accessToken, refreshToken, token } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBatterAuthSessionCookie(res, token as string);

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "password change successful",
        data: result
    })
})

const logout = catchAsync(async (req: Request, res: Response) => { 
    const betterAuthSession = req.cookies["betterAuthSession"];
    const result = await authService.logOutUser(betterAuthSession);
    cookieUtils.clearCookies(res, 'accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    cookieUtils.clearCookies(res, 'refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })
    cookieUtils.clearCookies(res, 'betterAuthSession', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "log out successful",
        data: result
    })
})

const verifyEmail = catchAsync(async (req: Request, res: Response) => { 
    const { otp, email } = req.body;
    await authService.verifyEmail(email, otp);
        sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "email verified successful",

    })
})
const forgetPassword = catchAsync(async (req: Request, res: Response) => { 
    const { email } = req.body;
    await authService.forgetPassword(email);
        sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "pass reset otp send successful",

    })
})
const resetPassword = catchAsync(async (req: Request, res: Response) => { 
    const { email,otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
        sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "pass reset  successful",

    })
})
const googleLogin = catchAsync((req: Request, res: Response) => {
    const redirectPath = req.query.redirect || "/dashboard";

    const encodedRedirectPath = encodeURIComponent(redirectPath as string);

    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

    res.render("googleRedirect", {
        callbackURL : callbackURL,
        betterAuthUrl : envVars.BETTER_AUTH_URL,
    })
})
const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => { 
    const redirectUrl = req.query.redirect as string || "/dashboard";


    const sessionToken = req.cookies["better-auth.session_token"];


    if (!sessionToken) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=oath_failed`);
    }

    const session = await auth.api.getSession({
        headers: {
            "Cookie": `better-auth.session_token=${sessionToken}`
        }
    })
    if (!session) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`)
    }

    if (session && !session.user) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_users_found`)
    }
    const result = await authService.googleLoginSuccess(session)
    const { accessToken, refreshToken } = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);

    const isValidRedirectPath = redirectUrl.startsWith("/") && !redirectUrl.startsWith("//");

    const finalRedirectPath = isValidRedirectPath ? redirectUrl : "/dashboard?error=false";
    res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);

})
const handleOathError = catchAsync(async (req: Request, res: Response) => { 
    const error = req.query.error as string || "oath failed";
    res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`)
 
})


export const authController = {
    registerPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logout,
    verifyEmail,
    forgetPassword,
    resetPassword,
    handleOathError,
    googleLoginSuccess,
    googleLogin
}