import type { Specialty } from "../../../generated/prisma/client"
import { prisma } from "../../lib/prisma"

const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
    
    const result = await prisma.specialty.create({
        data: payload
    })
    return result
}
const getAllSpecialty = async () => {
    const result = await prisma.specialty.findMany()
    return result
}
const deleteSpecialty = async (id: string) => {
    const result = await prisma.specialty.delete({
        where: {
            id
        }
    })
    return result
}
const updateSpecialty = async (id: string, payload: any) => {
    const result = await prisma.specialty.update({
        data: payload,
        where: {
            id
        }
    })
    return result
}

export const specialtyService = {
    createSpecialty,
    getAllSpecialty,
    deleteSpecialty,
    updateSpecialty
    
}