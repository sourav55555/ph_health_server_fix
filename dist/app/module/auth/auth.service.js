"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const enums_1 = require("../../../generated/prisma/enums");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const auth_1 = require("../../lib/auth");
const prisma_1 = require("../../lib/prisma");
const token_1 = require("../../utils/token");
const jwt_1 = require("../../utils/jwt");
const env_1 = require("../../../config/env");
const createPatient = async (payload) => {
    const { name, email, password } = payload;
    const data = await auth_1.auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            role: enums_1.Role.PATIENT
        }
    });
    if (!data.user) {
        // throw new Error("no patient created")
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Failed to register patient");
    }
    try {
        const patient = await prisma_1.prisma.$transaction(async (tx) => {
            const patientx = await tx.patient.create({
                data: {
                    userId: data.user.id,
                    name: payload.name,
                    email: payload.email
                }
            });
            return patientx;
        });
        const accessToken = token_1.tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            inDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified
        });
        const refreshToken = token_1.tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            inDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified
        });
        return {
            ...data,
            accessToken,
            refreshToken,
            patient
        };
    }
    catch (e) {
        console.log("transaction error", e);
        await prisma_1.prisma.user.delete({
            where: {
                id: data.user.id
            }
        });
        throw e;
    }
};
const loginUser = async (payload) => {
    const { email, password } = payload;
    const data = await auth_1.auth.api.signInEmail({
        body: {
            email,
            password
        }
    });
    if (data.user.status === enums_1.UserStatus.BLOCKED) {
        // throw new Error(" User is blocked")
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, " User is blocked");
    }
    if (data.user.isDeleted || data.user.status === enums_1.UserStatus.DELETED) {
        // throw new Error(" User id deleted")
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, " User is deleted");
    }
    const accessToken = token_1.tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        inDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    });
    const refreshToken = token_1.tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        inDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    });
    return {
        ...data,
        accessToken,
        refreshToken
    };
};
const getMe = async (user) => {
    const isUserExists = await prisma_1.prisma.user.findUnique({
        where: { id: user.userId },
        include: {
            patient: {
                include: {
                    appointments: true,
                    reviews: true,
                    prescriptions: true,
                    medicalReports: true,
                    patientHealthData: true
                }
            },
            doctor: {
                include: {
                    specialties: true,
                    appointments: true,
                    reviews: true,
                    prescriptions: true
                }
            },
            admin: true
        }
    });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user not found");
    }
    return isUserExists;
};
const getNewToken = async (refreshToken, sessionToken) => {
    const isSessionTokenExists = await prisma_1.prisma.session.findUnique({
        where: {
            token: sessionToken,
        },
        include: {
            user: true
        }
    });
    if (!isSessionTokenExists) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "invalid session token.");
    }
    const verifyRefreshToken = await jwt_1.jwtUtils.verifyToken(refreshToken, env_1.envVars.REFRESH_TOKEN_SECRET);
    if (!verifyRefreshToken.success && verifyRefreshToken.error) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid refresh token");
    }
    const data = verifyRefreshToken.data;
    const newAccessToken = token_1.tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        inDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    });
    const newRefreshToken = token_1.tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        inDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    });
    const { token } = await prisma_1.prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date()
        }
    });
    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        sessionToken: token
    };
};
const changePassword = async (payload, sessionToken) => {
    const validSession = await auth_1.auth.api.getSession({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    });
    if (!validSession) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Invalid session token");
    }
    const { currentPassword, newPassword } = payload;
    const result = await auth_1.auth.api.changePassword({
        body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: true
        },
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    });
    if (validSession.user.needsPasswordChange) {
        await prisma_1.prisma.user.update({
            where: {
                id: validSession.user.id
            },
            data: {
                needsPasswordChange: false
            }
        });
    }
    const accessToken = token_1.tokenUtils.getAccessToken({
        userId: validSession.user.id,
        role: validSession.user.role,
        name: validSession.user.name,
        email: validSession.user.email,
        status: validSession.user.status,
        inDeleted: validSession.user.isDeleted,
        emailVerified: validSession.user.emailVerified
    });
    const refreshToken = token_1.tokenUtils.getRefreshToken({
        userId: validSession.user.id,
        role: validSession.user.role,
        name: validSession.user.name,
        email: validSession.user.email,
        status: validSession.user.status,
        inDeleted: validSession.user.isDeleted,
        emailVerified: validSession.user.emailVerified
    });
    return { ...result, accessToken, refreshToken };
};
const logOutUser = async (sessionToken) => {
    const result = await auth_1.auth.api.signOut({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    });
    return result;
};
const verifyEmail = async (email, otp) => {
    const result = await auth_1.auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    });
    if (result.status && !result.user.emailVerified) {
        await prisma_1.prisma.user.update({
            where: {
                email
            },
            data: {
                emailVerified: true
            }
        });
    }
};
const forgetPassword = async (email) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user not found");
    }
    if (!user.emailVerified) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "email is not verified");
    }
    if (user.isDeleted || user.status === enums_1.UserStatus.DELETED) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user not found");
    }
    await auth_1.auth.api.requestPasswordResetEmailOTP({
        body: {
            email
        }
    });
};
const resetPassword = async (email, otp, newPassword) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user not found");
    }
    if (!user.emailVerified) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "email is not verified");
    }
    if (user.isDeleted || user.status === enums_1.UserStatus.DELETED) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user not found");
    }
    await auth_1.auth.api.resetPasswordEmailOTP({
        body: {
            email,
            otp,
            password: newPassword
        }
    });
    if (user.needsPasswordChange) {
        await prisma_1.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                needsPasswordChange: false
            }
        });
    }
    await prisma_1.prisma.session.deleteMany({
        where: {
            userId: user.id
        }
    });
};
const googleLoginSuccess = async (session) => {
    const isPatientExists = await prisma_1.prisma.patient.findUnique({
        where: {
            id: session.user.id
        }
    });
    console.log(isPatientExists, "exists");
    if (!isPatientExists) {
        const patientCreate = await prisma_1.prisma.patient.create({
            data: {
                userId: session.user.id,
                name: session.user.name,
                email: session.user.email
            }
        });
        console.log(patientCreate, "pp create");
    }
    const accessToken = token_1.tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name
    });
    const refreshToken = token_1.tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name
    });
    return {
        accessToken, refreshToken
    };
};
exports.authService = {
    createPatient,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logOutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
    googleLoginSuccess
};
//# sourceMappingURL=auth.service.js.map