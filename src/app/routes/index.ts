import { Router } from "express";
import { SpecialtyRouter } from "../module/speciality/speciality.router.js";
import { AuthRoute } from "../module/auth/auth.route.js";

const router = Router();

router.use("/specialty", SpecialtyRouter);
router.use("/auth", AuthRoute)


export const IndexRouter = router