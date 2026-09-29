import { Request, Router, Response, NextFunction } from "express";
import { userController } from "./user.controller";
import z from "zod";
import { Gender, Role } from "../../../generated/prisma/enums";
import { validateSchema } from "../../middleware/validateRequest";
import { createDoctorZodSchema } from "./user.validation";
import { createAdminZodSchema } from "../admin/admin.validator";
import { checkAuth } from "../../middleware/checkAuth";


const router = Router();




router.post("/create-doctor", validateSchema(createDoctorZodSchema), userController.createDoctor)
router.post("/create-admin", checkAuth(Role.SUPER_ADMIN), validateSchema(createAdminZodSchema), userController.createAdmin)
router.post("/create-super-admin", validateSchema(createAdminZodSchema), userController.createSuperAdmin)

export const  UserRoutes  = router