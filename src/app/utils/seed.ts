import { envVars } from "../../config/env"
import { Role } from "../../generated/prisma/enums"
import { auth } from "../lib/auth"
import { prisma } from "../lib/prisma"

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await prisma.user.findFirst({
            where: {
                role: Role.SUPER_ADMIN
            }
        })
        if (isSuperAdminExists) {
            console.log("super admin already exists")
            return;
        }

        const superAdminUser = await auth.api.signUpEmail({
            body: {
                email: envVars.SUPER_ADMIN_EMAIL,
                password:envVars.SUPER_ADMIN_PASSWORD,
                name: "Super Admin",
                role: Role.SUPER_ADMIN,
                needsPasswordChange: false,
                rememberMe: false
            }
        })

        const result = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: superAdminUser.user.id
                },
                data: {
                    emailVerified: true
                }
            })
            await tx.admin.create({
                data: {
                    userId: superAdminUser.user.id,
                    name: "super admin",
                    email:envVars.SUPER_ADMIN_EMAIL
                }
            })
        })

        const superAdmin = await prisma.admin.findFirst({
            where: {
                email: envVars.SUPER_ADMIN_EMAIL
            },
            include: {
                user: true
            }
        })
        console.log("super admin created", superAdmin)
    } catch (e) {
        console.error(e, "error seeding super admin")
        await prisma.user.delete({
            where: {
                email: envVars.SUPER_ADMIN_EMAIL
            }
        })
    }
}