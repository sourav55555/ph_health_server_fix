"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const enums_1 = require("../../../generated/prisma/enums");
const auth_1 = require("../../lib/auth");
const prisma_1 = require("../../lib/prisma");
const createPatient = async (payload) => {
    const { name, email, password } = payload;
    const data = await auth_1.auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            role: enums_1.Role.PATIENT
        }
    });
    if (!data.user) {
        throw new Error("no patient created");
    }
    const patient = await prisma_1.prisma.$transaction(async (tx) => {
        const patientx = await tx.patient.create({
            data: {
                userId: data.user.id,
                name: payload.name,
                email: payload.email
            }
        });
        return patientx;
    });
    return {
        ...data,
        patient
    };
};
const loginUser = async (payload) => {
    const { email, password } = payload;
    const data = await auth_1.auth.api.signInEmail({
        body: {
            email,
            password
        }
    });
    if (data.user.status === enums_1.UserStatus.BLOCKED) {
        throw new Error(" User is blocked");
    }
    if (data.user.isDeleted || data.user.status === enums_1.UserStatus.DELETED) {
        throw new Error(" User id deleted");
    }
    return data;
};
exports.authService = {
    createPatient,
    loginUser
};
//# sourceMappingURL=auth.service.js.map