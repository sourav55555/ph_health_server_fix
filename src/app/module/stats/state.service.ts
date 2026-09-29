import status from "http-status";
import { PaymentStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/requestUser.interface"
import { prisma } from "../../lib/prisma";

const getDashboardStatsData = async (user: IRequestUser) => {
    let statsData;


    switch (user.role) {
        case Role.SUPER_ADMIN:
            statsData = getSuperAdminStatsData();
            break;
        case Role.ADMIN:
            statsData = getAdminStatsData();
            break;
        case Role.DOCTOR:
            statsData = getDoctorStatsData(user)
            break;
        case Role.PATIENT:
            statsData = getPatientStatsData(user)
            break;

        default:
            throw new AppError(status.BAD_REQUEST, "invalid user role")
        

    }
    return statsData
}
const getSuperAdminStatsData = async ()=>{

    const appointmentCount = await prisma.appointment.count();
    const doctorCount = await prisma.doctor.count();
    const patientCount = await prisma.patient.count();

    const superAdminCount = await prisma.admin.count({
        where: {
            user: {
                role: Role.SUPER_ADMIN
            }
        }
    });
    const adminCount = await prisma.admin.count();
    const paymentCount = await prisma.payment.count();
    const userCount = await prisma.user.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum:{amount: true},
        where: {
            status: PaymentStatus.PAID
        }
    })
    const pieChartData = await getPieChartData();
    const barChartData = await getBarChartData()

    return {
        appointmentCount,
        doctorCount,
        patientCount,
        adminCount,
        superAdminCount,
        paymentCount,
        userCount,
        totalRevenue: totalRevenue._sum.amount || 0,
        pieChartData,
        barChartData
    }

}
const getAdminStatsData = async ()=>{

        const appointmentCount = await prisma.appointment.count();
    const doctorCount = await prisma.doctor.count();
    const patientCount = await prisma.patient.count();


    const adminCount = await prisma.admin.count();
    const paymentCount = await prisma.payment.count();
    const userCount = await prisma.user.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum:{amount: true},
        where: {
            status: PaymentStatus.PAID
        }
    })
    const pieChartData = await getPieChartData();
    const barChartData = await getBarChartData()

    return {
        appointmentCount,
        doctorCount,
        patientCount,
        adminCount,
        pieChartData,
        barChartData,
 
        paymentCount,
        userCount,
        totalRevenue: totalRevenue._sum.amount || 0
    }
}
const getDoctorStatsData = async (user: IRequestUser) => {

    const doctorData = await prisma.doctor.findFirstOrThrow(
        {
            where: {
                email: user.email
            },
            include: {
                appointments: true,
                reviews: true,
                user: true
            }
        }
    )
    const reviewCount = await prisma.review.count({
        where: {
            doctorId: doctorData.id
        }
    })
    const patientCount = await prisma.appointment.groupBy({
        by: ["patientId"],
        _count: {
            id:true
        }, 
        where: {
            doctorId: doctorData.id
        }
    })

    const appointmentCount = await prisma.appointment.count({
        where: {
            doctorId:doctorData.id
        }
    })

    const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
            appointment: {
                doctorId: doctorData.id
            },
            status: PaymentStatus.PAID
        }
    })

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: {
            id: true
        },
        where: {
            doctorId: doctorData.id
        }
    })

    const formattedAppointmentStatusDistribution = 
        appointmentStatusDistribution.map(({_count,status}) => ({
            status,
            count: _count.id
    }))

    return {
        reviewCount,
        patientCount: patientCount.length,
        totalRevenue: totalRevenue._sum.amount || 0,
        appointmentCount,
        appointmentStatusDistribution: formattedAppointmentStatusDistribution
    }


 }
const getPatientStatsData = async (user: IRequestUser) => {
     const patientData = await prisma.patient.findFirstOrThrow(
        {
            where: {
                email: user.email
            }
        }
    )
    const reviewCount = await prisma.review.count({
        where: {
            patientId: patientData.id
        }
    })
        const appointmentCount = await prisma.appointment.count({
        where: {
            patientId:patientData.id
        }
    })

    
    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: {
            id: true
        },
        where: {
            patientId: patientData.id
        }
    })

    const formattedAppointmentStatusDistribution = 
        appointmentStatusDistribution.map(({_count,status}) => ({
            status,
            count: _count.id
    }))

    return {
        appointmentStatusDistribution:formattedAppointmentStatusDistribution,
        reviewCount,
        appointmentCount
    }

}

const getPieChartData = async () => {
    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: {
            id: true
        }
    })

    const formattedAppointmentStatusDistribution =
        appointmentStatusDistribution.map(({ _count, status }) => ({
            status,
            count: _count.id
        }))

        return formattedAppointmentStatusDistribution
}

const getBarChartData = async () => {

    interface AppointmentCountByMonth{
        month: Date,
        count: bigint
    }
    const appointmentCountByMonth: AppointmentCountByMonth[] = await prisma.
        $queryRaw`
            SELECT DATE_TRUNC('month', "createdAt") as month,
            CAST(COUNT(*) AS INTEGER) as count
            FROM "appointments"
            GROUP BY month
            ORDER BY month ASC;
    `

    return appointmentCountByMonth
}

export const statsService = {
    getDashboardStatsData
}