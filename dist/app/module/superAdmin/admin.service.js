"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorService = void 0;
const prisma_1 = require("../../lib/prisma");
const getAllDoctors = async () => {
    const data = await prisma_1.prisma.doctor.findMany({
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    });
    return data;
};
const getDocById = async (id) => {
    const res = await prisma_1.prisma.doctor.findUnique({
        where: {
            id: id
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty: true
                }
            }
        }
    });
    return res;
};
const updateDoc = async (id, payload) => {
    const res = await prisma_1.prisma.doctor.update({
        data: payload,
        where: {
            id
        }
    });
    return res;
};
const deleteDoc = async (id) => {
    const res = await prisma_1.prisma.doctor.update({
        data: {
            isDeleted: true,
            deletedAt: new Date()
        },
        where: {
            id
        }
    });
    return res;
};
exports.doctorService = {
    getAllDoctors,
    getDocById,
    updateDoc,
    deleteDoc
};
//# sourceMappingURL=admin.service.js.map