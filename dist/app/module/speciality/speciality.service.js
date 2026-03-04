"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtyService = void 0;
const prisma_1 = require("../../lib/prisma");
const createSpecialty = async (payload) => {
    const result = await prisma_1.prisma.specialty.create({
        data: payload
    });
    return result;
};
const getAllSpecialty = async () => {
    const result = await prisma_1.prisma.specialty.findMany();
    return result;
};
const deleteSpecialty = async (id) => {
    const result = await prisma_1.prisma.specialty.delete({
        where: {
            id
        }
    });
    return result;
};
const updateSpecialty = async (id, payload) => {
    const result = await prisma_1.prisma.specialty.update({
        data: payload,
        where: {
            id
        }
    });
    return result;
};
exports.specialtyService = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty,
    updateSpecialty
};
//# sourceMappingURL=speciality.service.js.map