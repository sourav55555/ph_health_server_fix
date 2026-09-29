export interface IUpdateDoctorPayload{
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    experience?: number;
}

export interface ICreateSuperAdminPayload {

    password: string;
    admin: {
        name: string;
        email: string;

        profilePhoto: string;
        contactNumber: string;
       
    },

}