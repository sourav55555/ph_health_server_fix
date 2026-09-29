import { Router } from "express";
import { SpecialtyRouter } from "../module/speciality/speciality.router.js";
import { AuthRoute } from "../module/auth/auth.route.js";
import {  UserRoutes } from "../module/user/user.route.js";
import { docRouter } from "../module/doctor/doctor.route.js";
import { adminRouter } from "../module/admin/admin.route.js";
import { scheduleRoutes } from "../module/schedule/schedule.route.js";
import { DoctorScheduleRoutes } from "../module/doctorSchedule/doctorSchedule.router.js";
import { AppointmentRoutes } from "../module/appointment/appointment.route.js";
import { PatientRoutes } from "../module/patient/patient.route.js";
import { PrescriptionRoutes } from "../module/prescription/prescription.route.js";
import {  statsRoutes } from "../module/stats/stats.route.js";
import { PaymentRoutes } from "../module/payment/payment.route.js";

const router = Router();

router.use("/specialty", SpecialtyRouter);
router.use("/auth", AuthRoute)
router.use("/users", UserRoutes)
router.use("/doctors", docRouter)
router.use("/admin", adminRouter)
router.use("/schedules", scheduleRoutes)
router.use("/doctor-schedules", DoctorScheduleRoutes)
router.use("/appointments", AppointmentRoutes)
router.use("/patients", PatientRoutes)
router.use("/prescriptions", PrescriptionRoutes)
router.use("/stats", statsRoutes)
router.use("/payments", PaymentRoutes)





export const IndexRouter = router