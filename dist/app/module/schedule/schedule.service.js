"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const date_fns_1 = require("date-fns");
const schedule_utiles_1 = require("./schedule.utiles");
const prisma_1 = require("../../lib/prisma");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const schedule_constants_1 = require("./schedule.constants");
const getAllSchedules = async (query) => {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(prisma_1.prisma.schedule, query, {
        searchableFields: schedule_constants_1.scheduleSearchableFields,
        filterableFields: schedule_constants_1.scheduleFilterableFields
    });
    const result = await queryBuilder
        .search()
        .filter()
        .paginate()
        .dynamicInclude(schedule_constants_1.scheduleIncludeConfig)
        .sort()
        .fields()
        .execute();
    return result;
};
const getScheduleById = async (id) => {
    const result = await prisma_1.prisma.schedule.findUnique({
        where: {
            id
        }
    });
    return result;
};
const createSchedule = async (payload) => {
    const { startDate, endDate, startTime, endTime } = payload;
    const interval = 30;
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    const schedules = [];
    while (currentDate <= lastDate) {
        const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, 'yyyy-MM-dd')}`, Number(startTime.split(":")[0])), Number(startTime.split(":")[1])));
        const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(currentDate, 'yyyy-MM-dd')}`, Number(endTime.split(":")[0])), Number(endTime.split(":")[1])));
        while (startDateTime < endDateTime) {
            const s = await (0, schedule_utiles_1.convertDateTime)(startDateTime);
            const e = await (0, schedule_utiles_1.convertDateTime)((0, date_fns_1.addMinutes)(startDateTime, interval));
            const scheduleData = {
                startDateTime: s,
                endDateTime: e
            };
            const existingSchedule = await prisma_1.prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });
            if (!existingSchedule) {
                const result = await prisma_1.prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result);
            }
            startDateTime.setMinutes(startDateTime.getMinutes() + interval);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return schedules;
};
// refactoring - doctor's appointment or booked slot conflict check
const updateSchedule = async (id, payload) => {
    const { startDate, endDate, startTime, endTime } = payload;
    const startDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(new Date(startDate), 'yyyy-MM-dd')}`, Number(startTime.split(':')[0])), Number(startTime.split(':')[1])));
    const endDateTime = new Date((0, date_fns_1.addMinutes)((0, date_fns_1.addHours)(`${(0, date_fns_1.format)(new Date(endDate), 'yyyy-MM-dd')}`, Number(endTime.split(':')[0])), Number(endTime.split(':')[1])));
    const updatedSchedule = await prisma_1.prisma.schedule.update({
        where: {
            id: id
        },
        data: {
            startDateTime: startDateTime,
            endDateTime: endDateTime
        }
    });
    return updatedSchedule;
};
const deleteSchedule = async (id) => {
    await prisma_1.prisma.schedule.delete({
        where: {
            id: id
        }
    });
    return true;
};
exports.ScheduleService = {
    getAllSchedules,
    createSchedule,
    getScheduleById,
    deleteSchedule,
    updateSchedule
};
//# sourceMappingURL=schedule.service.js.map