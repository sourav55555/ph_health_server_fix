import express, { Application, Request, Response} from 'express'
import cors from 'cors';
import qs from 'qs';
import { IndexRouter } from './app/routes';
import { globalErrorHandler } from './app/middleware/errorHandeler';
import { notFound } from './app/middleware/notFound';
import cookieParser from 'cookie-parser';
import { auth } from './app/lib/auth';
import { toNodeHandler } from "better-auth/node"
import path from 'node:path';
import { envVars } from './config/env';
import { paymentController } from './app/module/payment/payment.controller';
import cron from 'node-cron'
import { AppointmentService } from './app/module/appointment/appointment.service';



const app: Application = express();
app.set("query parser", (str: string)=> qs.parse(str))

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/template`))

app.post("/webhook", express.raw({ type: "application/json" }),paymentController.handleStripeWebhookEvent)

app.use("/api/auth", toNodeHandler(auth))

app.use(cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders:["Content-type", "Authorization"]
}))

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

cron.schedule("*/25 * * * *", async () => {
    try{
        console.log("running cron unpaid appointments");
        await AppointmentService.cancelUnpaidAppointments();
    } catch (error: any) {
        console.error("error occurred while cancel unpaid appointment", error.message)
    }
})

// app.all("/api/auth/*splat", toNodeHandler(auth));

// app.use("/posts", postRouter);
// app.use("/comments", commentRouter)

app.get("/", (req, res) => {
    res.send("Hello, World!");
});



app.use("/api/v1", IndexRouter)
app.use(globalErrorHandler)
app.use(notFound)
// app.use(errorHandler)
export default app;