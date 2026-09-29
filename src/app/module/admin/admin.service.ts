import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma"
import { IChangeUserRolePayload, IChangeUserStatusPayload, IUpdateAdminPayload } from "./admin.interface"
import { Role, UserStatus } from "../../../generated/prisma/enums";

const getAllAdmins = async () => {
    const data = await prisma.admin.findMany(
        {
            include: {
                user: {
                    select: {
                        id: true,
                        role: true
                    }
                }
            }
        }
    );
    return data
}
const getAdminById = async (id: string) => {
    const data = await prisma.admin.findUnique(
        {
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
        }
    );
    return data
}

const getDocById = async (id: string) => {
    const res = await prisma.doctor.findUnique({
        where: {
            id: id
        },
        include: {
            user: true,
            specialties: {
                include: {
                    specialty:true
                }
            }
        }
    })
    return res
}


const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  const { name, ...rest } = payload

  const res = await prisma.admin.update({
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
  })

  return res
}
const softDeleteAdmin = async (id: string, user: IRequestUser) => {

    const isAdminExists = await prisma.admin.findUnique({
        where: {
            id
        }
    })
    if (!isAdminExists) {
        throw new AppError( status.NOT_FOUND,"Admin doesn't exists")
    }
    if (isAdminExists.id === user.userId) {
        throw new AppError(status.BAD_REQUEST,"You can't delete yourself")
    }
    const res = await prisma.admin.update({
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
    })
    return res
}

const changeStatus = async (user: IRequestUser, payload: IChangeUserStatusPayload) => {
    const isAdminExists = await prisma.admin.findUniqueOrThrow({
        where: {
            email: user.email
        },
        include: {
            user: true
        }
    })

    const {userId, userStatus} = payload

    const userToChangeStatus = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    const selfStatusChange = isAdminExists.userId === userId;

    if (selfStatusChange) {
        throw new AppError(status.BAD_REQUEST,"You can't change your own status")
    }
    if (isAdminExists.user.role === Role.ADMIN && userToChangeStatus.role === Role.SUPER_ADMIN) {
        throw new AppError(status.BAD_REQUEST,"You can't change status of super admin")
    }
    if (isAdminExists.user.role === Role.ADMIN && userToChangeStatus.role === Role.ADMIN) {
        throw new AppError(status.BAD_REQUEST,"You can't change status of admin, only super admin can")
    }
    if (userStatus === UserStatus.DELETED) {
        throw new AppError(status.BAD_REQUEST,"user specific doctor delete user api to delete the user")
    }

    const updateUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status: userStatus as UserStatus
        }
    })

    return updateUser

}

const changeUserRole= async (user: IRequestUser, payload: IChangeUserRolePayload) => {
    const isSuperAdminExists = await prisma.admin.findUniqueOrThrow({
        where: {
            email: user.email,
            user: {
                role: Role.SUPER_ADMIN
            }
        },
        include: {
            user: true
        }
    })

    const {userId, role} = payload

    const userToChangeStatus = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    const selfStatusChange = isSuperAdminExists.userId === userId;

    if (selfStatusChange) {
        throw new AppError(status.BAD_REQUEST,"You can't change your own role")
    }
    if (userToChangeStatus.role === Role.DOCTOR || userToChangeStatus.role === Role.PATIENT ) {
        throw new AppError(status.BAD_REQUEST,"You can't change the role of doc or patient")
    }
  

    const updateUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            role: role 
        }
    })

    return updateUser

}


export const adminService = {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    softDeleteAdmin,
    changeStatus,
    changeUserRole
}