"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const enums_1 = require("../../generated/prisma/enums");
const cookie_1 = require("../utils/cookie");
const prisma_1 = require("../lib/prisma");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const jwt_1 = require("../utils/jwt");
const env_1 = require("../../config/env");
const checkAuth = (...authRoles) => async (req, res, next) => {
    try {
        const sessionToken = cookie_1.cookieUtils.getCookie(req, "betterAuthSession");
        if (!sessionToken) {
            throw new Error("Unauthorized access! no token provided.");
        }
        if (sessionToken) {
            const sessionExists = await prisma_1.prisma.session.findFirst({
                where: {
                    token: sessionToken,
                    expiresAt: {
                        gt: new Date()
                    }
                },
                include: {
                    user: true
                }
            });
            if (sessionExists && sessionExists.user) {
                const user = sessionExists.user;
                const now = new Date();
                const expiresAt = new Date(sessionExists.expiresAt);
                const createdAt = new Date(sessionExists.createdAt);
                console.log(user, authRoles, "session user");
                const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
                const timeRemaining = expiresAt.getTime() - now.getTime();
                const percentageRemaining = (timeRemaining / sessionLifeTime) * 100;
                if (percentageRemaining < 20) {
                    res.setHeader("X-Session-Refresh", 'true');
                    res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
                    res.setHeader("X-Time-Remaining", timeRemaining.toString());
                    console.log("session expire soon");
                }
                if (user.status === enums_1.UserStatus.BLOCKED || user.status === enums_1.UserStatus.DELETED) {
                    throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "unauthorized, user is not active");
                }
                if (user.isDeleted) {
                    throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "unauthorized, user is deleted");
                }
                if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                    throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Forbidden access, you don't have permission to access this route");
                }
                req.user = {
                    userId: user.id,
                    role: user.role,
                    email: user.email
                };
            }
        }
        // access token er kaj kote hobee
        const accessToken = cookie_1.cookieUtils.getCookie(req, "accessToken");
        if (!accessToken) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized! no access token provided");
        }
        const verifiedToken = jwt_1.jwtUtils.verifyToken(accessToken, env_1.envVars.ACCESS_TOKEN_SECRET);
        if (!verifiedToken.success) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "unauthorized! Invalid access token");
        }
      
        // if (verifiedToken.data!.role !== 'ADMIN') {
        //     throw new AppError(status.FORBIDDEN, 'Forbidden access! You dont have permission to access this')
        // }
        if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden access! You don\'t have permission to access this');
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.checkAuth = checkAuth;
//# sourceMappingURL=checkAuth.js.map