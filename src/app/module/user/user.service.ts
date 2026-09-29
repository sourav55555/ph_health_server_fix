import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";
import { ICreateAdminPayload } from "../admin/admin.interface";
import { ICreateSuperAdminPayload } from "../superAdmin/superAdmin.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
    const specialties: Specialty[] = []

    for (const specialtyId of payload.specialties) {
        const specialty = await prisma.specialty.findUnique({
            where: {
                id: specialtyId
            }
        })
        if (!specialty) {
            // throw new Error(`${specialtyId} id not found in specialty`)
            throw new AppError(status.NOT_FOUND, `${specialtyId} id not found in specialty`)
        }
        specialties.push(specialty)
    }

    const userExists = await prisma.doctor.findUnique({
        where: {
            email: payload.doctor.email
        }
    })
    if (userExists) {
        // throw new Error("User already exists with this email")
        throw new AppError(status.CONFLICT, `User already exists with this email`)
    }

    const userData = await auth.api.signUpEmail({
        body: {
            email: payload.doctor.email,
            password: payload.password,
            role: Role.DOCTOR,
            needsPasswordChange: true,
            name: payload.doctor.name
        }
    })

    try {
        const result = await prisma.$transaction( async(tx) => {
            const doctorData = await tx.doctor.create({

                data: {
                    userId: userData.user.id,
                    ...payload.doctor
                }
            })
            const doctorSpecialtyData = specialties.map((specialty) => {
                return {
                    doctorId: doctorData.id,
                    specialtyId: specialty.id
                }
            })
            await tx.doctorSpecialty.createMany({
                data: doctorSpecialtyData
            })

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
            })
            return doctor
        })
        return result;
    } catch (err) {
        console.log(err);
        await prisma.user.delete({
            where: {
                id: userData.user.id
            }
        })
        throw err
    }

}

const createAdmin = async (payload: ICreateAdminPayload) => {
    const adminExists = await prisma.admin.findUnique({
        where: {
            email: payload.admin.email
        }
    }) 
    if (adminExists) {
        throw new AppError( status.CONFLICT,"Admin already exists with this email")
    }
    const adminData = await auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            name: payload.admin.name,
            password: payload.password,
            role: Role.ADMIN,
            needsPasswordChange: false
        }
    })
    try {
        const result = await prisma.admin.create({
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
                })

                return result
    } catch (err) {
        console.log(err);
        await prisma.user.delete({
            where: {
                id: adminData.user.id
            }
        })
        throw err
   }
}
const createSuperAdmin = async (payload: ICreateSuperAdminPayload) => {
    const adminExists = await prisma.superAdmin.findUnique({
        where: {
            email: payload.admin.email
        }
    }) 
    if (adminExists) {
        throw new AppError( status.CONFLICT,"Super Admin already exists with this email")
    }
    const superAdminData = await auth.api.signUpEmail({
        body: {
            email: payload.admin.email,
            name: payload.admin.name,
            password: payload.password,
            role: Role.SUPER_ADMIN,
            needsPasswordChange: false
        }
    })
    try {
        const result = await prisma.superAdmin.create({
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
                })

                return result
    } catch (err) {
        console.log(err);
        await prisma.user.delete({
            where: {
                id: superAdminData.user.id
            }
        })
        throw err
   }
}

export const userService = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}