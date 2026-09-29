import status from "http-status";
import { PaymentStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload, IUpdateReviewPayload } from "./review.interface";

const giveReview = async (user: IRequestUser, payload: ICreateReviewPayload) => {
    const patient = await prisma.patient.findFirstOrThrow({
        where: {
            id: user.userId
        }
    })

    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    })

    if (appointmentData.paymentStatus !== PaymentStatus.PAID) {
        throw new AppError(status.BAD_REQUEST, "You can only review after payment is done")
    }

    if (appointmentData.patientId !== patient.id) {
        throw new AppError(status.BAD_REQUEST, "You can only review for your own appointment")
    }

    const isReviewed = await prisma.review.findFirst({
        where: {
            appointmentId: payload.appointmentId
        }
    })

    if (isReviewed) {
         throw new AppError(status.BAD_REQUEST, "You already reviewed this appointment")
    }

    const result = await prisma.$transaction(async (tx) => {
        const review = await tx.review.create({
            data: {
                ...payload,

                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId
            }
        })
        const averageRating = await tx.review.aggregate({
            where: {
                doctorId: appointmentData.doctorId
            },
            _avg: {
                rating: true
            }
        }) || { _avg: { rating: 0 } };
        await tx.doctor.update({
            where: {
                id: appointmentData.doctorId
            },
            data: {
                averageRating: averageRating._avg.rating as number
            }
        })

        return review
    })
    return result;
}


const getAllReviews = async () => {
    const reviews = await prisma.review.findMany({
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    })

    return reviews
}

const myReviews = async (user: IRequestUser) => {
    const IsUserExist = await prisma.user.findUnique({
        where: {
            email: user?.email
        }
    })
    if (!user) {
        throw new AppError(status.BAD_REQUEST, "only patients can view their reviews")
    }
    if (IsUserExist?.role === Role.DOCTOR) {
        const doctorData = await prisma.doctor.findUniqueOrThrow({
            where: {
                email: user.email
            }
        })

        return await prisma.review.findMany({
            where: {
                doctorId: doctorData.id
            },
            include: {
                patient: true,
                appointment: true
            }
        })
    }
    if (IsUserExist?.role === Role.PATIENT) {
        const doctorData = await prisma.patient.findUniqueOrThrow({
            where: {
                email: user.email
            }
        })

        return await prisma.review.findMany({
            where: {
                patientId: doctorData.id
            },
            include: {
                doctor: true,
                appointment: true
            }
        })
    }

}

const updateReview = async (user: IRequestUser, reviewId: string, payload: IUpdateReviewPayload) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    })
    const reviewData = await prisma.review.findUniqueOrThrow({
        where: {
            id:reviewId
        }
    })

    if (patientData.id !== reviewData.patientId) {
        throw new AppError(status.BAD_REQUEST, "This is not your review!")
    }

    const result = await prisma.$transaction(async (tx) => {
        const updateReview = await tx.review.update({
            where: {
                id: reviewId
            },
            data: {
                rating: payload.rating,
                comment: payload.comment
            }
        })
        const averageRating = await tx.review.aggregate({
            where: {
                doctorId: reviewData.doctorId
            },
            _avg: {
                rating: true
            }
        })

        await tx.doctor.update({
            where: {
                id: updateReview.doctorId
            },
            data: {
                averageRating: averageRating._avg.rating as number
            }
        })

        return updateReview
    })
    return result

}


const deleteReview = async (user: IRequestUser, reviewId: string) => {
     const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
     })
    
    const reviewData = await prisma.review.findUniqueOrThrow({
        where: {
            id:reviewId
        }
    })

    if (patientData.id !== reviewData.patientId) {
        throw new AppError(status.BAD_REQUEST, "This is not your review!")
    }

     const result = await prisma.$transaction(async (tx) => {
        const deleteReview = await tx.review.delete({
            where: {
                id: reviewId
            }
        })
        const averageRating = await tx.review.aggregate({
            where: {
                doctorId: reviewData.doctorId
            },
            _avg: {
                rating: true
            }
        })

        await tx.doctor.update({
            where: {
                id: deleteReview.doctorId
            },
            data: {
                averageRating: averageRating._avg.rating as number
            }
        })

        return deleteReview
    })
    return result
}

export const ReviewService = {
    giveReview,
    getAllReviews,
    updateReview,
    deleteReview,
    myReviews
}