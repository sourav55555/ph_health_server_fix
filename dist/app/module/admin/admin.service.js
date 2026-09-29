"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const prisma_1 = require("../../lib/prisma");
const getAllAdmins = async () => {
    const data = await prisma_1.prisma.admin.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    role: true
                }
            }
        }
    });
    return data;
};
const getAdminById = async (id) => {
    const data = await prisma_1.prisma.admin.findUnique({
        where: {
            id
        },
        include: {
            user: {
                select: {
                    id: true,
                    role: true
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
const updateAdmin = async (id, payload) => {
    const { name, ...rest } = payload;
    const res = await prisma_1.prisma.admin.update({
        where: { id },
        data: {
            ...rest,
            ...(name !== undefined
                ? {
                    name,
                    user: {
                        update: {
                            name,
                        },
                    },
                }
                : {}),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    role: true,
                },
            },
        },
    });
    return res;
};
const softDeleteAdmin = async (id, user) => {
    const isAdminExists = await prisma_1.prisma.admin.findUnique({
        where: {
            id
        }
    });
    if (!isAdminExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Admin doesn't exists");
    }
    if (isAdminExists.id === user.userId) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "You can't delete yourself");
    }
    const res = await prisma_1.prisma.admin.update({
        data: {
            isDeleted: true,
            deletedAt: new Date(),
            user: {
                update: {
                    isDeleted: true
                }
            }
        },
        where: {
            id
        },
        include: {
            user: true
        }
    });
    return res;
};
exports.adminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    softDeleteAdmin
};
//# sourceMappingURL=admin.service.js.map