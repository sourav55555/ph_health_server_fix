"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("../../../generated/prisma/client");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const auth_1 = require("../../lib/auth");
const prisma_1 = require("../../lib/prisma");
const createDoctor = async (payload) => {
    const specialties = [];
    for (const specialtyId of payload.specialties) {
        const specialty = await prisma_1.prisma.specialty.findUnique({
            where: {
                id: specialtyId
            }
        });
        if (!specialty) {
            // throw new Error(`${specialtyId} id not found in specialty`)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, `${specialtyId} id not found in specialty`);
        }
        specialties.push(specialty);
    }
    const userExists = await prisma_1.prisma.doctor.findUnique({
        where: {
            email: payload.doctor.email
        }
    });
    if (userExists) {
        // throw new Error("User already exists with this email")
        throw new AppError_1.default(http_status_1.default.CONFLICT, `User already exists with this email`);
    }
    const userData = await auth_1.auth.api.signUpEmail({
        body: {
            email: payload.doctor.email,
            password: payload.password,
            role: client_1.Role.DOCTOR,
            needsPasswordChange: true,
            name: payload.doctor.name
        }
    });
    try {
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            const doctorData = await tx.doctor.create({
                data: {
                    userId: userData.user.id,
                    ...payload.doctor
                }
            });
            const doctorSpecialtyData = specialties.map((specialty) => {
                return {
                    doctorId: doctorData.id,
                    specialtyId: specialty.id
                };
            });
            await tx.doctorSpecialty.createMany({
                data: doctorSpecialtyData
            });
            const doctor = await tx.doctor.findUnique({
                where: {
                    id: doctorData.id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    currentWorkingPlace: true,
                    designation: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true,
                            image: true,
                            status: true,
                            isDeleted: true,
                            emailVerified: true,
                            deletedAt: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    },
                    specialties: {
                        select: {
                            specialty: {
                                select: {
                                    title: true,
                                    id: true
                                }
                            }
                        }
                    }
                }
            });
            return doctor;
        });
        return result;
    }
    catch (err) {
        console.log(err);
        await prisma_1.prisma.user.delete({
            where: {
                id: userData.user.id
            }
        });
        throw err;
    }
};
const createAdmin = async (payload) => {
    const adminExists = await prisma_1.prisma.admin.findUnique({
        where: {
            email: payload.admin.email
        }
    });
    if (adminExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Admin already exists with this email");
    }
    const adminData = await auth_1.auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            name: payload.admin.name,
            password: payload.password,
            role: client_1.Role.ADMIN,
            needsPasswordChange: false
        }
    });
    try {
        const result = await prisma_1.prisma.admin.create({
            data: {
                userId: adminData.user.id,
                ...payload.admin
            },
            select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
                user: {
                    select: {
                        id: true,
                        role: true
                    }
                }
            }
        });
        return result;
    }
    catch (err) {
        console.log(err);
        await prisma_1.prisma.user.delete({
            where: {
                id: adminData.user.id
            }
        });
        throw err;
    }
};
const createSuperAdmin = async (payload) => {
    const adminExists = await prisma_1.prisma.superAdmin.findUnique({
        where: {
            email: payload.admin.email
        }
    });
    if (adminExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Super Admin already exists with this email");
    }
    const superAdminData = await auth_1.auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            name: payload.admin.name,
            password: payload.password,
            role: client_1.Role.SUPER_ADMIN,
            needsPasswordChange: false
        }
    });
    try {
        const result = await prisma_1.prisma.superAdmin.create({
            data: {
                userId: superAdminData.user.id,
                ...payload.admin
            },
            select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
                user: {
                    select: {
                        id: true,
                        role: true
                    }
                }
            }
        });
        return result;
    }
    catch (err) {
        console.log(err);
        await prisma_1.prisma.user.delete({
            where: {
                id: superAdminData.user.id
            }
        });
        throw err;
    }
};
exports.userService = {
    createDoctor,
    createAdmin,
    createSuperAdmin
};
//# sourceMappingURL=user.service.js.map