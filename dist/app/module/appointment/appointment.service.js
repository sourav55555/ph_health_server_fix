"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
// import { uuidv7 } from "zod/mini";
const uuid_1 = require("uuid");
const enums_1 = require("../../../generated/prisma/enums");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const prisma_1 = require("../../lib/prisma");
const enums_2 = require("./../../../generated/prisma/enums");
// Pay Now Book Appointment
const bookAppointment = async (payload, user) => {
    const patientData = await prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });
    const doctorData = await prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false,
        }
    });
    const scheduleData = await prisma_1.prisma.schedule.findUniqueOrThrow({
        where: {
            id: payload.scheduleId,
        }
    });
    const doctorSchedule = await prisma_1.prisma.doctorSchedules.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleData.id,
            }
        }
    });
    const videoCallingId = String((0, uuid_1.v7)());
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                doctorId: payload.doctorId,
                patientId: patientData.id,
                scheduleId: doctorSchedule.scheduleId,
                videoCallingId,
            }
        });
        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId,
                }
            },
            data: {
                isBooked: true,
            }
        });
        //TODO : Payment Integration will be here
        const transactionId = String((0, uuid_1.v7)());
        const paymentData = await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: `Appointment with Dr. ${doctorData.name}`,
                        },
                        unit_amount: doctorData.appointmentFee * 100,
                    },
                    quantity: 1,
                }
            ],
            metadata: {
                appointmentId: appointmentData.id,
                paymentId: paymentData.id,
            },
            success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success`,
            // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
            cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments`,
        });
        return {
            appointmentData,
            paymentData,
            paymentUrl: session.url,
        };
    });
    return {
        appointment: result.appointmentData,
        payment: result.paymentData,
        paymentUrl: result.paymentUrl,
    };
};
const getMyAppointments = async (user) => {
    //user can be patient or doctor, so we need to check both
    const patientData = await prisma_1.prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });
    const doctorData = await prisma_1.prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });
    let appointments = [];
    if (patientData) {
        appointments = await prisma_1.prisma.appointment.findMany({
            where: {
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true
            }
        });
    }
    else if (doctorData) {
        appointments = await prisma_1.prisma.appointment.findMany({
            where: {
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    }
    else {
        throw new Error("User not found");
    }
    return appointments;
};
// 1. Completed Or Cancelled Appointments should not be allowed to update status
// 2. Doctors can only update Appoinment status from schedule to inprogress or inprogress to complted or schedule to cancelled.
// 3. Patients can only cancel the scheduled appointment if it scheduled not completed or cancelled or inprogress. 
// 4. Admin and Super admin can update to any status.
const changeAppointmentStatus = async (appointmentId, appointmentStatus, user) => {
    const appointmentData = await prisma_1.prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId,
            // status: AppointmentStatus.SCHEDULED
        },
        include: {
            doctor: true
        }
    });
    // if (!appointmentData) {
    //     throw new AppError(status.NOT_FOUND, "Appointment not found or already completed/cancelled");
    // }
    if (user?.role === enums_1.Role.DOCTOR) {
        if (!(user?.email === appointmentData.doctor.email))
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "This is not your appointment");
    }
    return await prisma_1.prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status: appointmentStatus
        }
    });
};
// refactoring on include of doctor and patient data in appointment details, we can use query builder to get the data in single query instead of multiple queries in case of doctor and patient both
const getMySingleAppointment = async (appointmentId, user) => {
    const patientData = await prisma_1.prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });
    const doctorData = await prisma_1.prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });
    let appointment;
    if (patientData) {
        appointment = await prisma_1.prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                patientId: patientData.id
            },
            include: {
                doctor: true,
                schedule: true
            }
        });
    }
    else if (doctorData) {
        appointment = await prisma_1.prisma.appointment.findFirst({
            where: {
                id: appointmentId,
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                schedule: true
            }
        });
    }
    if (!appointment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Appointment not found");
    }
    return appointment;
};
// integrate query builder
const getAllAppointments = async () => {
    const appointments = await prisma_1.prisma.appointment.findMany({
        include: {
            doctor: true,
            patient: true,
            schedule: true
        }
    });
    return appointments;
};
const bookAppointmentWithPayLater = async (payload, user) => {
    const patientData = await prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });
    const doctorData = await prisma_1.prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId,
            isDeleted: false,
        }
    });
    const scheduleData = await prisma_1.prisma.schedule.findUniqueOrThrow({
        where: {
            id: payload.scheduleId,
        }
    });
    const doctorSchedule = await prisma_1.prisma.doctorSchedules.findUniqueOrThrow({
        where: {
            doctorId_scheduleId: {
                doctorId: doctorData.id,
                scheduleId: scheduleData.id,
            }
        }
    });
    const videoCallingId = String((0, uuid_1.v7)());
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                doctorId: payload.doctorId,
                patientId: patientData.id,
                scheduleId: doctorSchedule.scheduleId,
                videoCallingId,
            }
        });
        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: payload.doctorId,
                    scheduleId: payload.scheduleId,
                }
            },
            data: {
                isBooked: true,
            }
        });
        const transactionId = String((0, uuid_1.v7)());
        const paymentData = await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId,
            }
        });
        return {
            appointment: appointmentData,
            payment: paymentData
        };
    });
    return result;
};
const initiatePayment = async (appointmentId, user) => {
    const patientData = await prisma_1.prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });
    const appointmentData = await prisma_1.prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId,
            patientId: patientData.id,
        },
        include: {
            doctor: true,
            payment: true,
        }
    });
    if (!appointmentData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Appointment not found");
    }
    if (!appointmentData.payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment data not found for this appointment");
    }
    if (appointmentData.payment?.status === enums_1.PaymentStatus.PAID) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Payment already completed for this appointment");
    }
    ;
    if (appointmentData.status === enums_2.AppointmentStatus.CANCELED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Appointment is canceled");
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: `Appointment with Dr. ${appointmentData.doctor.name}`,
                    },
                    unit_amount: appointmentData.doctor.appointmentFee * 100,
                },
                quantity: 1,
            }
        ],
        metadata: {
            appointmentId: appointmentData.id,
            paymentId: appointmentData.payment.id,
        },
        success_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-success?appointment_id=${appointmentData.id}&payment_id=${appointmentData.payment.id}`,
        // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
        cancel_url: `${envVars.FRONTEND_URL}/dashboard/appointments?error=payment_cancelled`,
    });
    return {
        paymentUrl: session.url,
    };
};
const cancelUnpaidAppointments = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const unpaidAppointments = await prisma_1.prisma.appointment.findMany({
        where: {
            // status: AppointmentStatus.SCHEDULED,
            createdAt: {
                lte: thirtyMinutesAgo,
            },
            paymentStatus: enums_1.PaymentStatus.UNPAID,
        },
    });
    const appointmentToCancel = unpaidAppointments.map(appointment => appointment.id);
    await prisma_1.prisma.$transaction(async (tx) => {
        await tx.appointment.updateMany({
            where: {
                id: {
                    in: appointmentToCancel,
                },
            },
            data: {
                status: enums_2.AppointmentStatus.CANCELED,
            },
        });
        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentToCancel,
                },
            },
        });
        for (const unpaidAppointment of unpaidAppointments) {
            await tx.doctorSchedules.update({
                where: {
                    doctorId_scheduleId: {
                        doctorId: unpaidAppointment.doctorId,
                        scheduleId: unpaidAppointment.scheduleId,
                    },
                },
                data: {
                    isBooked: false,
                },
            });
        }
    });
};
exports.AppointmentService = {
    bookAppointment,
    getMyAppointments,
    changeAppointmentStatus,
    getMySingleAppointment,
    getAllAppointments,
    bookAppointmentWithPayLater,
    initiatePayment,
    cancelUnpaidAppointments,
};
//# sourceMappingURL=appointment.service.js.map