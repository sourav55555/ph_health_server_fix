import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
    password: z.string("password is required").min(6, "Password min 6 character").max(20, "password max 20 character "),
    doctor: z.object({
        name: z.string("Name is required").min(5, "Name min 5 character").max(30, "Name max 30 character"),
        email: z.email("Email is required"),
        contactNumber: z.string("Contact number is required").min(11, "Contact number min 11 character").max(14, "Contact number max 14 character"),
        address: z.string("Address is required").min(10, "Address min 10 character").max(100, "Address max 100 character").optional(),
        registrationNumber: z.string("Registration number is required"),
        experience: z.int("Experience must be an integer").nonnegative("Experience must be a non-negative integer").optional(),
        gender: z.enum([Gender.MALE, Gender.FEMALE], "Gender must be either male or female"),
        appointmentFee: z.number("Appointment fee must be a number").nonnegative("Appointment fee must be a non-negative number"),
        qualification: z.string("Qualification is required").min(5, "Qualification min 5 character").max(50, "Qualification max 50 character"),
        currentWorkingPlace: z.string("Current working place is required").min(5, "Current working place min 5 character").max(50, "Current working place max 50 character"),
        designation: z.string("Designation is required").min(5, "Designation min 5 character").max(50, "Designation max 50 character"),

    }),
    specialties: z.array(z.uuid("Specialty ID must be a valid UUID")).min(1, "At least one specialty ID is required")
})
