import z from "zod";

export const createSpecialtyZodSchema = z.object({
    title: z.string("title is required"),
    description: z.string("description is required").optional()

})

