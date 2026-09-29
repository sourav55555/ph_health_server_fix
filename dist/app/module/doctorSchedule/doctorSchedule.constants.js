"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorScheduleIncludeConfig = exports.doctorScheduleFilterableFields = exports.doctorScheduleSearchableFields = void 0;
exports.doctorScheduleSearchableFields = [
    'id',
    'doctorId',
    'scheduleId'
];
exports.doctorScheduleFilterableFields = [
    'id',
    'doctorId',
    'scheduleId',
    'createdAt',
    'updatedAt',
    'isBooked',
    'schedule.startDateTime',
    'schedule.endDateTime',
];
exports.doctorScheduleIncludeConfig = {
    doctor: {
        include: {
            appointments: true,
            specialties: true
        }
    },
    schedule: true
};
//# sourceMappingURL=doctorSchedule.constants.js.map