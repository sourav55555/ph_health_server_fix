"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const prisma_2 = require("./prisma");
const enums_1 = require("../../generated/prisma/enums");
const env_1 = require("../../config/env");
// If your Prisma file is located elsewhere, you can change the path
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma_2.prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: enums_1.Role.PATIENT
            },
            status: {
                type: "string",
                required: true,
                defaultValue: enums_1.UserStatus.ACTIVE
            },
            needsPasswordChange: {
                type: "boolean",
                required: true,
                defaultValue: false
            },
            isDeleted: {
                type: "boolean",
                required: true,
                defaultValue: false
            },
            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null
            }
        }
    },
    trustedOrigins: [env_1.envVars.BETTER_AUTH_URL || "http://localhost:3000"]
});
//# sourceMappingURL=auth.js.map