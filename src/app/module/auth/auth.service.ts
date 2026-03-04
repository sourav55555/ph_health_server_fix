import { Role, UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

interface IRegisterPayload{
    name: string;
    email: string;
    password: string
}
interface ILoginPayload{

    email: string;
    password: string
}

const createPatient = async (payload: IRegisterPayload) => {
    const { name, email, password } = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            role: Role.PATIENT
        }
    })

    if (!data.user) {
        throw new Error("no patient created")
    }

    const patient = await prisma.$transaction(async (tx) => {
        const patientx = await tx.patient.create({
            data: {
                userId: data.user.id,
                name: payload.name,
                email: payload.email
            }
        }
    )
    return patientx
    })
    return {
        ...data,
        patient
    }
}

const loginUser = async (payload: ILoginPayload) => {
    const { email, password } = payload;
    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })
    if (data.user.status === UserStatus.BLOCKED) {
        throw new Error(" User is blocked")
    }
    if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
        throw new Error(" User id deleted")
    }
    return data;
}

export const authService = {
    createPatient,
    loginUser
}
