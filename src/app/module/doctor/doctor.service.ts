import status from "http-status"
import AppError from "../../errorHelpers/AppError"
import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./doctor.interface"
import { UserStatus } from "../../../generated/prisma/enums"
import { QueryBuilder } from "../../utils/QueryBuilder"
import { IQueryParams } from "../../interfaces/query.interface"
import { doctorFilterableFields, doctorIncludeConfig, doctorSearchableFields } from "./doctor.constant"
import { Doctor, Prisma } from "../../../generated/prisma/client"

const getAllDoctors = async (query: IQueryParams) => {
    // const data = await prisma.doctor.findMany({
    //     include: {
    //         user: true,
    //         specialties: {
    //             include: {
    //                 specialty:true
    //             }
    //         }
    //     }
    // })
    // return data

    const queryBuilder = new QueryBuilder<Doctor, Prisma.DoctorWhereInput, Prisma.DoctorInclude>(
        prisma.doctor,
        query,
        {
            searchableFields: doctorSearchableFields,
            filterableFields: doctorFilterableFields
        }
    )

    const result = await queryBuilder
        .search()
        .filter()
        .where({
        isDeleted:false
        })
        .include({
            user: true,
            // specialties: {
            //     include: {
            //         specialty: true
            //     }
            // }
            specialties: true
        })
        .dynamicInclude(doctorIncludeConfig)
        .paginate()
        .sort()
        .fields()
        .execute()
    
    return result
    
}

const getDocById = async (id: string) => {
    const res = await prisma.doctor.findUnique({
        where: {
            id: id,
            isDeleted: false
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty:true
                }
            },
            appointments: {
                include: {
                    patient: true,
                    schedule: true,
                    prescription: true,

                }
            },
            doctorSchedules: {
                include: {
                    schedule: true
                }
            },
            reviews: true
        }
    })
    return res
}

const updateDoc = async (id: string, payload: IUpdateDoctorPayload) => {
    // const res = await prisma.doctor.update({
    //     data: payload,
    //     where: {
    //         id
    //     }
    // })
    // return res
    const isDoctorExists = await prisma.doctor.findUnique({
        where: {
            id
        }
    })
    if (!isDoctorExists) {
        throw new AppError(status.NOT_FOUND, "Doctor not found")
    }

    const { doctor: doctorData, specialties } = payload;
    await prisma.$transaction(async (tx) => {
        if (doctorData) {
            await tx.doctor.update({
                where: {
                    id,
            },
                data: {
                    ...doctorData
                }
            })
        }
        if (specialties && specialties.length > 0) {
            for (const specialty of specialties) {
                const { specialtyId, shouldDelete } = specialty
                if (shouldDelete) {
                    await tx.doctorSpecialty.delete({
                        where: {
                            doctorId_specialtyId: {
                                doctorId: id,
                                specialtyId,

                            }
                        }
                    })
                } else {
                    await tx.doctorSpecialty.upsert({
                        where :{
                            doctorId_specialtyId: {
                                    doctorId: id,
                                specialtyId,

                            }
                        },
                        create: {
                            doctorId: id,
                            specialtyId
                        },
                        update:{}
                    })
                }
            }
        }
    })
    const doctor = getDocById(id)
    return doctor
}
const deleteDoc = async (id: string) => {
    const isDoc = await prisma.doctor.findUnique({
        where: {
            id
        },
        include: {
            user: true
        }
    })
    if (!isDoc) {
        throw new AppError(status.NOT_FOUND, "Doctor not found")
    }
    await prisma.$transaction(async (tx) => {
        await tx.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
        await tx.user.update({
            where: {
                id: isDoc.userId
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED
            }
        })
        await tx.session.deleteMany({
            where: {
                userId: isDoc.userId
            }
        })
        await tx.doctorSchedules.deleteMany({
            where: {
                doctorId: id
            }
        })
    })
    return {message: "Doctor delete successful"}
}

export const doctorService = {
    getAllDoctors,
    getDocById,
    updateDoc, 
    deleteDoc
}