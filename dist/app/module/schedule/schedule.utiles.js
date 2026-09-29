"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDateTime = void 0;
const convertDateTime = async (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset);
};
exports.convertDateTime = convertDateTime;
//# sourceMappingURL=schedule.utiles.js.map