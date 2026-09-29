import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import { email, JWTPayload } from "better-auth/*";
import { IChangePassPayload, ILoginPayload, IRegisterPayload, RefreshTokenPayload } from "./auth.interface";
import { getAccessToken } from "better-auth/api";



const createPatient = async (payload: IRegisterPayload) => {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            role: Role.PATIENT
        }
    })
    

    if (!data.user) {
        // throw new Error("no patient created")
        throw new AppError(status.BAD_REQUEST, "Failed to register patient")
    }
    try {
          const patient = await prisma.$transaction(async (tx) => {
        const patientx = await tx.patient.create({
            data: {
                userId: data.user.id,
                name: payload.name,
                email: payload.email
            }
        }
    )
              return patientx
              
              
          })
        
          const accessToken = tokenUtils.getAccessToken({
                userId: data.user.id,
                role: data.user.role,
                name: data.user.name,
                email: data.user.email,
                status: data.user.status,
                inDeleted: data.user.isDeleted,
                emailVerified: data.user.emailVerified
            })
            const refreshToken = tokenUtils.getRefreshToken({
                userId: data.user.id,
                role: data.user.role,
                name: data.user.name,
                email: data.user.email,
                status: data.user.status,
                inDeleted: data.user.isDeleted,
                emailVerified: data.user.emailVerified
            })
         return {
             ...data,
             accessToken,
             refreshToken,
                patient
            }
    } catch (e) {
        console.log("transaction error", e)
        await prisma.user.delete({
            where: {
                id: data.user.id
            }
        })
        throw e
    }
  
   
}

const loginUser = async (payload: ILoginPayload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })
    if (data.user.status === UserStatus.BLOCKED) {
        // throw new Error(" User is blocked")
         throw new AppError(status.FORBIDDEN," User is blocked")
    }
    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        // throw new Error(" User id deleted")
        throw new AppError(status.NOT_FOUND," User is deleted")
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        inDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })
    const refreshToken = tokenUtils.getRefreshToken({
        userId: data.user.id,
        role: data.user.role,
        name: data.user.name,
        email: data.user.email,
        status: data.user.status,
        inDeleted: data.user.isDeleted,
        emailVerified: data.user.emailVerified
    })
    return {
        ...data,
        accessToken,
        refreshToken
    };
}

const getMe = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
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
       
    })
    if (!isUserExists) {
        throw new AppError(status.NOT_FOUND, "user not found")
    }

    return isUserExists
}

const getNewToken = async (refreshToken: string, sessionToken: string) => {


    const isSessionTokenExists = await prisma.session.findUnique({
        where: {
            token: sessionToken,
        },
        include: {
            user: true
        }
    })
    if (!isSessionTokenExists) {
        throw new AppError(status.UNAUTHORIZED, "invalid session token.")
    }
    const verifyRefreshToken = await jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)

    if (!verifyRefreshToken.success && verifyRefreshToken.error) {
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token")
    }

    const  data = verifyRefreshToken.data as RefreshTokenPayload

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        inDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    })
    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        inDeleted: data.isDeleted,
        emailVerified: data.emailVerified
    })
    const { token} = await prisma.session.update({
        where: {
            token: sessionToken
        },
        data: {
            token: sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date()
        }
    })

    return {
        accessToken :newAccessToken,
        refreshToken :newRefreshToken,
        sessionToken: token
    }
}

const changePassword = async (payload: IChangePassPayload, sessionToken: string) => {
    const validSession = await auth.api.getSession({
        headers: new Headers({
            Authorization :`Bearer ${sessionToken}`
        })
    })
    if (!validSession) {
        throw new AppError( status.NOT_FOUND,"Invalid session token")
    }
    const { currentPassword, newPassword } = payload;

    const result = await auth.api.changePassword({
        body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: true
        },
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    }) 

    if (validSession.user.needsPasswordChange) {
        
        await prisma.user.update({
            where:{
                id: validSession.user.id
            },
            data: {
                needsPasswordChange: false
            }
        })
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: validSession.user.id,
        role: validSession.user.role,
        name: validSession.user.name,
        email: validSession.user.email,
        status: validSession.user.status,
        inDeleted: validSession.user.isDeleted,
        emailVerified: validSession.user.emailVerified
    })
    const refreshToken = tokenUtils.getRefreshToken({
        userId: validSession.user.id,
        role: validSession.user.role,
        name: validSession.user.name,
        email: validSession.user.email,
        status: validSession.user.status,
        inDeleted: validSession.user.isDeleted,
        emailVerified: validSession.user.emailVerified
    })

    return { ...result, accessToken, refreshToken }
}

const logOutUser = async (sessionToken: string) => {
    const result = await auth.api.signOut({
        headers: new Headers({
            Authorization: `Bearer ${sessionToken}`
        })
    })
    return result
}

const verifyEmail = async (email: string, otp: string) => {
    const result = await auth.api.verifyEmailOTP({
        body: {
            email,
            otp
        }
    })
    if (result.status && !result.user.emailVerified) {
        await prisma.user.update({
            where: {
                email
            },
            data: {
              emailVerified: true  
            }
        })
    }
}

const forgetPassword = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new AppError( status.NOT_FOUND,"user not found")
    }
    if (!user.emailVerified) {
         throw new AppError( status.NOT_FOUND,"email is not verified")
    }
    if (user.isDeleted || user.status === UserStatus.DELETED) {
         throw new AppError( status.NOT_FOUND,"user not found")
    }

    await auth.api.requestPasswordResetEmailOTP({
        body: {
            email
        }
    })
}

const resetPassword = async (email: string,otp:string,newPassword: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new AppError(status.NOT_FOUND, "user not found")
    }
    if (!user.emailVerified) {
        throw new AppError(status.NOT_FOUND, "email is not verified")
    }
    if (user.isDeleted || user.status === UserStatus.DELETED) {
        throw new AppError(status.NOT_FOUND, "user not found")
    }

    await auth.api.resetPasswordEmailOTP({
        body: {
            email,
            otp,
            password: newPassword
        }
    })

    
    if (user.needsPasswordChange) {
        
        await prisma.user.update({
            where:{
                id: user.id
            },
            data: {
                needsPasswordChange: false
            }
        })
    }

    await prisma.session.deleteMany({
        where: {
            userId: user.id
        }
    })
}

const googleLoginSuccess = async (session: Record<string, any>) => {
    const isPatientExists = await prisma.patient.findUnique({
        where: {
            id: session.user.id
        }
    })
    console.log(isPatientExists,"exists")

    if (!isPatientExists) {
        const patientCreate = await prisma.patient.create({
            data: {
                userId: session.user.id,
                name: session.user.name,
                email: session.user.email
            }
        })
        console.log(patientCreate, "pp create")
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name
    })

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name
    })

    return {
        accessToken, refreshToken
    }
}

export const authService = {
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
}
