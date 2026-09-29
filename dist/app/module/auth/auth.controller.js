"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = require("../../shared/catchAsync");
const auth_service_1 = require("./auth.service");
const http_status_1 = __importDefault(require("http-status"));
const token_1 = require("../../utils/token");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const cookie_1 = require("../../utils/cookie");
const env_1 = require("../../../config/env");
const auth_1 = require("../../lib/auth");
const registerPatient = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_1.authService.createPatient(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    token_1.tokenUtils.setAccessTokenCookie(res, accessToken);
    token_1.tokenUtils.setRefreshTokenCookie(res, refreshToken);
    token_1.tokenUtils.setBatterAuthSessionCookie(res, token);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.CREATED,
        success: true,
        message: "create successful",
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest
        }
    });
});
const loginUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_1.authService.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    token_1.tokenUtils.setAccessTokenCookie(res, accessToken);
    token_1.tokenUtils.setRefreshTokenCookie(res, refreshToken);
    token_1.tokenUtils.setBatterAuthSessionCookie(res, token);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        message: "login successful",
        data: {
            token,
            accessToken,
            refreshToken,
            ...rest
        }
    });
});
const getMe = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.authService.getMe(user);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        message: "login successful",
        data: result
    });
});
const getNewToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log(req.cookies, "cookieee");
    const betterAuthRefreshToken = req.cookies.refreshToken;
    const betterAuthSessionToken = req.cookies.betterAuthSession;
    if (!betterAuthRefreshToken) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "no refresh token available");
    }
    const result = await auth_service_1.authService.getNewToken(betterAuthRefreshToken, betterAuthSessionToken);
    const { accessToken, refreshToken, sessionToken, ...rest } = result;
    token_1.tokenUtils.setAccessTokenCookie(res, accessToken);
    token_1.tokenUtils.setRefreshTokenCookie(res, refreshToken);
    token_1.tokenUtils.setBatterAuthSessionCookie(res, sessionToken);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        message: "token refresh successful",
        data: {
            sessionToken,
            accessToken,
            refreshToken,
        }
    });
});
const changePassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = req.body;
    console.log(payload, "payload");
    const betterAuthSessionToken = req.cookies["betterAuthSession"];
    const result = await auth_service_1.authService.changePassword(payload, betterAuthSessionToken);
    const { accessToken, refreshToken, token } = result;
    token_1.tokenUtils.setAccessTokenCookie(res, accessToken);
    token_1.tokenUtils.setRefreshTokenCookie(res, refreshToken);
    token_1.tokenUtils.setBatterAuthSessionCookie(res, token);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        message: "password change successful",
        data: result
    });
});
const logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const betterAuthSession = req.cookies["betterAuthSession"];
    const result = await auth_service_1.authService.logOutUser(betterAuthSession);
    cookie_1.cookieUtils.clearCookies(res, 'accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    cookie_1.cookieUtils.clearCookies(res, 'refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    cookie_1.cookieUtils.clearCookies(res, 'betterAuthSession', {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        message: "log out successful",
        data: result
    });
});
const verifyEmail = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { otp, email } = req.body;
    await auth_service_1.authService.verifyEmail(email, otp);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        message: "email verified successful",
    });
});
const forgetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email } = req.body;
    await auth_service_1.authService.forgetPassword(email);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        message: "pass reset otp send successful",
    });
});
const resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    await auth_service_1.authService.resetPassword(email, otp, newPassword);
    (0, catchAsync_1.sendResponse)(res, {
        httpStatusCode: http_status_1.default.OK,
        success: true,
        message: "pass reset  successful",
    });
});
const googleLogin = (0, catchAsync_1.catchAsync)((req, res) => {
    const redirectPath = req.query.redirect || "/dashboard";
    const encodedRedirectPath = encodeURIComponent(redirectPath);
    const callbackURL = `${env_1.envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
    res.render("googleRedirect", {
        callbackURL: callbackURL,
        betterAuthUrl: env_1.envVars.BETTER_AUTH_URL,
    });
});
const googleLoginSuccess = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const redirectUrl = req.query.redirect || "/dashboard";
    const sessionToken = req.cookies["better-auth.session_token"];
    if (!sessionToken) {
        return res.redirect(`${env_1.envVars.FRONTEND_URL}/login?error=oath_failed`);
    }
    const session = await auth_1.auth.api.getSession({
        headers: {
            "Cookie": `better-auth.session_token=${sessionToken}`
        }
    });
    if (!session) {
        return res.redirect(`${env_1.envVars.FRONTEND_URL}/login?error=no_session_found`);
    }
    if (session && !session.user) {
        return res.redirect(`${env_1.envVars.FRONTEND_URL}/login?error=no_users_found`);
    }
    const result = await auth_service_1.authService.googleLoginSuccess(session);
    const { accessToken, refreshToken } = result;
    token_1.tokenUtils.setAccessTokenCookie(res, accessToken);
    token_1.tokenUtils.setRefreshTokenCookie(res, refreshToken);
    const isValidRedirectPath = redirectUrl.startsWith("/") && !redirectUrl.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectUrl : "/dashboard?error=false";
    res.redirect(`${env_1.envVars.FRONTEND_URL}${finalRedirectPath}`);
});
const handleOathError = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const error = req.query.error || "oath failed";
    res.redirect(`${env_1.envVars.FRONTEND_URL}/login?error=${error}`);
});
exports.authController = {
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
};
//# sourceMappingURL=auth.controller.js.map