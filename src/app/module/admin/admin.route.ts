import { Router } from "express";
import { adminController } from "./admin.controller";
import { validateSchema } from "../../middleware/validateRequest";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.SUPER_ADMIN),adminController.getAdmin)
router.get("/:id", checkAuth(Role.SUPER_ADMIN) ,adminController.getAdminById)
// router.post("/create-admin", validateSchema() , adminController.createAdmin)
router.put("/:id",  checkAuth(Role.SUPER_ADMIN),adminController.updateAdmin)
router.delete("/:id",checkAuth(Role.SUPER_ADMIN, Role.ADMIN),adminController.deleteAdmin)


router.patch("/change-user-status", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.changeUserStatus);
router.patch("/change-user-role", checkAuth(Role.SUPER_ADMIN), adminController.changeUserRole);


export const adminRouter = router