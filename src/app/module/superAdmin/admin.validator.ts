import z from "zod";

export const updateDoctorZodSchema = z.object({

}).partial()

export const createAdminZodSchema = z.object({
    password: z.string("password is required").min(8, "password min 8 character"),
    admin: z.object({
        name: z.string("Name is required").min(3, "name min 3 character"),
        email: z.email("Email is required"),
        contactNumber: z.string("Contact number is required").min(11, "Min 11 character").max(14, "max 14 character"),
        profilePhoto: z.string().optional()
    }),

})