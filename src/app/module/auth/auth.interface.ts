import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface IChangePassPayload{
    currentPassword: string;
    newPassword: string
}

export interface IRegisterPayload{
    name: string;
    email: string;
    password: string
}
export interface ILoginPayload{

    email: string;
    password: string
}

export interface RefreshTokenPayload {
 
    userId: string
    role: Role
    name: string
    email: string
    status: UserStatus
    isDeleted: boolean
    emailVerified: boolean
  }
