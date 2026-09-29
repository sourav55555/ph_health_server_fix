import { Router } from "express";
import { specialtyController } from "./speciality.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../../config/multer.config";
import { validateSchema } from "../../middleware/validateRequest";
import { createSpecialtyZodSchema } from "./speciality.validation";

const router = Router();

router.get("/",  specialtyController.getAllSpecialty)
router.post("/",
    // checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"), validateSchema(createSpecialtyZodSchema),specialtyController.createSpecialty)
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), specialtyController.deleteSpecialty)
router.put("/:id", specialtyController.updateSpecialty)

export const SpecialtyRouter = router