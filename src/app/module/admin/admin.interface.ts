import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface IUpdateAdminPayload{
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
}

export interface ICreateAdminPayload {

    password: string;
    admin: {
        name: string;
        email: string;

        profilePhoto: string;
        contactNumber: string;
       
    },

}

export interface IChangeUserRolePayload{
    userId: string;
    role: Role;

}
export interface IChangeUserStatusPayload{
    userId: string;
    userStatus: UserStatus;

}