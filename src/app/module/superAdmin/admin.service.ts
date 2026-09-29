import { prisma } from "../../lib/prisma"
import { IUpdateDoctorPayload } from "./superAdmin.interface"

const getAllDoctors = async () => {
    const data = await prisma.doctor.findMany({
        include: {
            user: true,
            specialties: {
                include: {
                    specialty:true
                }
            }
        }
    })
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

const updateDoc = async (id: string, payload: IUpdateDoctorPayload) => {
    const res = await prisma.doctor.update({
        data: payload,
        where: {
            id
        }
    })
    return res
}
const deleteDoc = async (id: string) => {
    const res = await prisma.doctor.update({
        data: {
            isDeleted: true,
            deletedAt: new Date()
        },
        where: {
            id
        }
    })
    return res
}

export const doctorService = {
    getAllDoctors,
    getDocById,
    updateDoc, 
    deleteDoc
}