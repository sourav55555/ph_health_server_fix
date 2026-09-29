"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorScheduleService = void 0;
const prisma_1 = require("../../lib/prisma");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const doctorSchedule_constants_1 = require("./doctorSchedule.constants");
const createDoctorSchedule = async (user, payload) => {
    const doctor = await prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
        doctorId: doctor.id,
        scheduleId
    }));
    const result = await prisma_1.prisma.doctorSchedules.createMany({
        data: doctorScheduleData
    });
    return result;
};
const getMyDoctorSchedule = async (user, query) => {
    const doctorData = await prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const queryBuilder = new QueryBuilder_1.QueryBuilder(prisma_1.prisma.doctorSchedules, {
        doctorId: doctorData.id,
        ...query
    }, {
        filterableFields: doctorSchedule_constants_1.doctorScheduleFilterableFields,
        searchableFields: doctorSchedule_constants_1.doctorScheduleSearchableFields
    });
    const doctorSchedules = await queryBuilder
        .search()
        .filter()
        .paginate()
        .include({
        schedule: true
    })
        .sort()
        .fields()
        .dynamicInclude(doctorSchedule_constants_1.doctorScheduleIncludeConfig)
        .execute();
    return doctorSchedules;
};
const getAllDoctorSchedule = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(prisma_1.prisma.doctorSchedules, query, {
        filterableFields: doctorSchedule_constants_1.doctorScheduleFilterableFields,
        searchableFields: doctorSchedule_constants_1.doctorScheduleSearchableFields
    });
    const doctorSchedules = await queryBuilder
        .search()
        .filter()
        .paginate()
        .sort()
        .fields()
        .dynamicInclude(doctorSchedule_constants_1.doctorScheduleIncludeConfig)
        .execute();
    return doctorSchedules;
};
const getDoctorScheduleById = async (doctorId, scheduleId) => {
    const doctorSchedule = await prisma_1.prisma.doctorSchedules.findUnique({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorId,
                scheduleId: scheduleId
            }
        },
        include: {
            schedule: true,
            doctor: true
        }
    });
    return doctorSchedule;
};
const updateMyDoctorSchedule = async (user, payload) => {
    const doctorData = await prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const deleteIds = payload.scheduleIds.filter(schedule => schedule.shouldDelete).map(schedule => schedule.id);
    const createIds = payload.scheduleIds.filter(schedule => !schedule.shouldDelete).map(schedule => schedule.id);
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        await tx.doctorSchedules.deleteMany({
            where: {
                doctorId: doctorData.id,
                scheduleId: {
                    in: deleteIds
                }
            }
        });
        const doctorScheduleData = createIds.map(scheduleId => ({
            doctorId: doctorData.id,
            scheduleId
        }));
        const result = await tx.doctorSchedules.createMany({
            data: doctorScheduleData
        });
        return result;
    });
    return result;
};
const deleteDoctorSchedule = async (id, user) => {
    const doctorData = await prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    await prisma_1.prisma.doctorSchedules.deleteMany({
        where: {
            doctorId: doctorData.id,
            scheduleId: id
        }
    });
};
exports.DoctorScheduleService = {
    createDoctorSchedule,
    updateMyDoctorSchedule,
    getMyDoctorSchedule,
    getAllDoctorSchedule,
    getDoctorScheduleById,
    deleteDoctorSchedule
};
//# sourceMappingURL=doctorSchedule.service.js.map