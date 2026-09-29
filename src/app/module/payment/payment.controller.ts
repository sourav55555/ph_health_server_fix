import status from "http-status";
import { envVars } from "../../../config/env";
import { catchAsync, sendResponse } from "../../shared/catchAsync";
import { Request, Response } from "express";
import { stripe } from "../../../config/stripe.config";
import { PaymentService } from "./payment.service";

 "express"

const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string
    const webHookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET

    if (!signature || !webHookSecret) {
        console.error("missing stripe signature or webhook secret")
        return res.status(status.BAD_REQUEST).json({
            message: "missing stripe signature or webhook secret"
        })
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webHookSecret)

    } catch (error: any) {
          console.error("error stripe signature or webhook secret", error)
        return res.status(status.BAD_REQUEST).json({
            message: "error stripe signature or webhook secret"
        })
    }

    try {
        const result = await PaymentService.handlerStripeWebhookEvent(event)

        sendResponse(res, {
            httpStatusCode: status.OK,
            success: true,
            message: "Stripe webhook event successful",
            data: result
        })
    } catch (error) {
           console.error("error stripe signature or webhook secret", error)
        return res.status(status.BAD_REQUEST).json({
            message: `error stripe signature or webhook secret${error}`
        })
    }
})

export const paymentController = {
    handleStripeWebhookEvent
}