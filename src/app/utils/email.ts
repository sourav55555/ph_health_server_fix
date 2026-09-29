import nodemailer from 'nodemailer'
import { envVars } from '../../config/env'
import AppError from '../errorHelpers/AppError';
import status from 'http-status';
import path from 'node:path';
import  ejs from 'ejs';

const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SENDER_SNTP_HOST,
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER_SNTP_USER,
        pass: envVars.EMAIL_SENDER_SNTP_PASS.replace(/\s+/g, '')
    },
    port: parseInt(envVars.EMAIL_SENDER_SNTP_PORT)
})

interface SendEmailOptions {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, any>;
    attachments?: {
        fileName: string;
        content: Buffer | string;
        contentType: string
    }[]
}

export const sendEmail = async ({ subject, templateData, templateName, to, attachments}: SendEmailOptions) => {
    
    
    try {

         const templatePath = path.resolve(process.cwd(), `src/app/template/${templateName}.ejs`);
         const html = await ejs.renderFile(templatePath, templateData);

        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER_SNTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.fileName,
                    content: attachment.content,
                        contentType: attachment.contentType
            }))
        })
        console.log("email sent to", to, info.messageId)
        
    } catch (error) {
        console.log(error, "email send error")
        throw new AppError(status.INTERNAL_SERVER_ERROR, "email send error")
    }
}