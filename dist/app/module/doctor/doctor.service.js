"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const prisma_1 = require("../../lib/prisma");
const enums_1 = require("../../../generated/prisma/enums");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const doctor_constant_1 = require("./doctor.constant");
const getAllDoctors = async (query) => {
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
    const queryBuilder = new QueryBuilder_1.QueryBuilder(prisma_1.prisma.doctor, query, {
        searchableFields: doctor_constant_1.doctorSearchableFields,
        filterableFields: doctor_constant_1.doctorFilterableFields
    });
    const result = await queryBuilder
        .search()
        .filter()
        .where({
        isDeleted: false
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
        .dynamicInclude(doctor_constant_1.doctorIncludeConfig)
        .paginate()
        .sort()
        .fields()
        .execute();
    return result;
};
const getDocById = async (id) => {
    const res = await prisma_1.prisma.doctor.findUnique({
        where: {
            id: id,
            isDeleted: false
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
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
    });
    return res;
};
const updateDoc = async (id, payload) => {
    // const res = await prisma.doctor.update({
    //     data: payload,
    //     where: {
    //         id
    //     }
    // })
    // return res
    const isDoctorExists = await prisma_1.prisma.doctor.findUnique({
        where: {
            id
        }
    });
    if (!isDoctorExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Doctor not found");
    }
    const { doctor: doctorData, specialties } = payload;
    await prisma_1.prisma.$transaction(async (tx) => {
        if (doctorData) {
            await tx.doctor.update({
                where: {
                    id,
                },
                data: {
                    ...doctorData
                }
            });
        }
        if (specialties && specialties.length > 0) {
            for (const specialty of specialties) {
                const { specialtyId, shouldDelete } = specialty;
                if (shouldDelete) {
                    await tx.doctorSpecialty.delete({
                        where: {
                            doctorId_specialtyId: {
                                doctorId: id,
                                specialtyId,
                            }
                        }
                    });
                }
                else {
                    await tx.doctorSpecialty.upsert({
                        where: {
                            doctorId_specialtyId: {
                                doctorId: id,
                                specialtyId,
                            }
                        },
                        create: {
                            doctorId: id,
                            specialtyId
                        },
                        update: {}
                    });
                }
            }
        }
    });
    const doctor = getDocById(id);
    return doctor;
};
const deleteDoc = async (id) => {
    const isDoc = await prisma_1.prisma.doctor.findUnique({
        where: {
            id
        },
        include: {
            user: true
        }
    });
    if (!isDoc) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Doctor not found");
    }
    await prisma_1.prisma.$transaction(async (tx) => {
        await tx.doctor.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });
        await tx.user.update({
            where: {
                id: isDoc.userId
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: enums_1.UserStatus.DELETED
            }
        });
        await tx.session.deleteMany({
            where: {
                userId: isDoc.userId
            }
        });
        await tx.doctorSchedules.deleteMany({
            where: {
                doctorId: id
            }
        });
    });
    return { message: "Doctor delete successful" };
};
exports.doctorService = {
    getAllDoctors,
    getDocById,
    updateDoc,
    deleteDoc
};
//# sourceMappingURL=doctor.service.js.map