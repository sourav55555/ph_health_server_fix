import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/",doctorController.getDoc)
router.get("/:id",doctorController.getDocById)
router.put("/:id",doctorController.updateDoc)
router.delete("/:id",doctorController.deleteDoc)

export const docRouter = router