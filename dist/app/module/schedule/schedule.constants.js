"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleIncludeConfig = exports.scheduleSearchableFields = exports.scheduleFilterableFields = void 0;
exports.scheduleFilterableFields = [
    'id',
    'startDateTime',
    'endDateTime'
];
exports.scheduleSearchableFields = [
    'id',
    'startDateTime',
    'endDateTime'
];
exports.scheduleIncludeConfig = {
    appointments: {
        include: {
            doctor: true,
            patient: true,
            payment: true,
            prescription: true,
            review: true
        }
    },
    doctorSchedule: true
};
//# sourceMappingURL=schedule.constants.js.map