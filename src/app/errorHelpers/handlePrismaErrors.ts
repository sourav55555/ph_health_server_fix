import status from "http-status"
import { Prisma } from "../../generated/prisma/client"
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface"

const getStatusCodeFromPrismaError = (errorCode: string): number => {
    //p2002 unique constrain failed
    if (errorCode === "P2002") {
        return status.CONFLICT
    }

    //not found error
    if (["P2025", "P2015", "P2018"].includes(errorCode)) {
        return status.NOT_FOUND
    }

    //db authentication errors
    if (["P1000", "P6002"].includes(errorCode)) {
        return status.UNAUTHORIZED
    }

    //access denied
    if (["P1010", "P6010"].includes(errorCode)) {
        return status.FORBIDDEN
    }

    //prisma accelerate plan limit exceed = 402 payment required
     if (errorCode === "P6003") {
        return status.PAYMENT_REQUIRED
    }

    //timeout error
    if (["P1008", "P2004","P6004"].includes(errorCode)) {
        return status.GATEWAY_TIMEOUT
    }

    //rate limit error
    if (errorCode === "P5011") {
        return status.TOO_MANY_REQUESTS
    }

    //response size limit exceed
    if (errorCode === "P6009") {
        return 413
    }

    //connection error
    if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
        return status.SERVICE_UNAVAILABLE
    }

    //except unhandled errors
    if (errorCode.startsWith("P1")) {
        return status.BAD_REQUEST
    }


    return status.INTERNAL_SERVER_ERROR
}


const formatErrorMeta = (meta?: Record<string, unknown>): string => {
    if (!meta) "";

    const parts: string[] = [];

    if (meta?.target) {
        parts.push(`Field(s): ${String(meta.target)} `)
    }

    if (meta?.field_name) {
        parts.push(`Field: ${String(meta.field_name)} `)
    }
    if (meta?.column_name) {
        parts.push(`Column: ${String(meta.column_name)} `)
    }

    if (meta?.table) {
        parts.push(`table:  ${String(meta.table)}`)
    }
    if (meta?.model_name) {
         parts.push(`Model:  ${String(meta.model_name)}`)
    }
    if (meta?.relation_name) {
         parts.push(`Relation:  ${String(meta.relation_name)}`)
    }
    if (meta?.constraint) {
         parts.push(`Constraint:  ${String(meta.constraint)}`)
    }
    if (meta?.database_error) {
         parts.push(`Database Error:  ${String(meta.database_error)}`)
    }

    return parts.length > 0 ? parts.join(" | ") : "" 

    
}

export const handlePrismaClientKnownReqError = (error: Prisma.PrismaClientKnownRequestError) : TErrorResponse  => {
    const statusCode = getStatusCodeFromPrismaError(error.code);
    const metaInfo = formatErrorMeta(error.meta)

    let cleanMessage = error.message;

    cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");

    //split by new line. take the first line as main message

    const lines = cleanMessage.split("\n").filter(line => line.trim());
    const mainMessage = lines[0] || "";

    const errorSources: TErrorSource[] = [
        {
            path: error.code,
            message : metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
        }
    ] 

    if (error.meta?.cause) {
        errorSources.push({
            path: "cause",
            message: String(error.meta.cause)
        })
    }

    return {
        success: false,
        statusCode,
        message: `Prisma client known request error ${mainMessage}`,
        errorSources,

    }
}

export const handlePrismaClientUnknownReqError = (error: Prisma.PrismaClientUnknownRequestError): TErrorResponse => {
    let cleanMessage = error.message;
    cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");

    //split by new line. take the first line as main message

    const lines = cleanMessage.split("\n").filter(line => line.trim());
    const mainMessage = lines[0] || "";

    const errorSources: TErrorSource[] = [
        {
            path: "Unknown prisma error",
            message: `Prisma client unknown request error ${mainMessage}`
        }
    ]

    return {
        success: false,
        statusCode: status.INTERNAL_SERVER_ERROR,
        message: `Prisma client unknown request error ${mainMessage}`,
        errorSources
    }
}


export const handlePrismaClientValidationError = (error: Prisma.PrismaClientValidationError): TErrorResponse => {
    let cleanMessage = error.message;
    cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");

    //split by new line. take the first line as main message

    const lines = cleanMessage.split("\n").filter(line => line.trim());


    const errorSources: TErrorSource[] = []

    //extract filed name for field specific validation error
    const filedMatch = cleanMessage.match(/Argument `(\w+)`/i);
    const fieldName = filedMatch ? filedMatch[1] : "unknown field"

    //main message
    const mainMessage = lines.find(line => 

        !line.includes("Argument") &&
        !line.includes("->") &&
        line.length > 10
    ) || lines[0] || "Invalid query parameter"

    errorSources.push({
        path: fieldName as string,
        message: mainMessage
    })
    return {
        success: false,
        statusCode: status.BAD_REQUEST,
        message: `Prisma client validation error ${mainMessage}`,
        errorSources
    }
}

export const handlePrismaClientInitializationError = (error: Prisma.PrismaClientInitializationError): TErrorResponse => {

    const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status.SERVICE_UNAVAILABLE;
    let cleanMessage = error.message;
    cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");

    //split by new line. take the first line as main message

    const lines = cleanMessage.split("\n").filter(line => line.trim());


    
    //extract filed name for field specific validation error
    // const filedMatch = cleanMessage.match(/Argument `(\w+)`/i);
    // const fieldName = filedMatch ? filedMatch[1] : "unknown field"
    
    //main message
    const mainMessage = lines[0] || "an error occurred while initializing the prisma client"
    
    const errorSources: TErrorSource[] = [
        {
        path: error.errorCode || "initialization error",
        message: mainMessage
    }
    ]

    return {
        success: false,
        statusCode,
        message: `Prisma client initialization error ${mainMessage}`,
        errorSources
    }
}
export const handlePrismaClientRustPanicError = (): TErrorResponse => {


    
    const errorSources: TErrorSource[] = [
        {
        path:  "rust engine crashed",
        message: "the database engine error rust error"
    }
    ]

    return {
        success: false,
        statusCode: status.INTERNAL_SERVER_ERROR,
        message: `Prisma client rust panic error: the db engine crashed due to a fatal error`,
        errorSources
    }
}



