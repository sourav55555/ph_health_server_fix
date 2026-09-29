"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const node_path_1 = __importDefault(require("node:path"));
const ejs_1 = __importDefault(require("ejs"));
const transporter = nodemailer_1.default.createTransport({
    host: env_1.envVars.EMAIL_SENDER_SNTP_HOST,
    secure: true,
    auth: {
        user: env_1.envVars.EMAIL_SENDER_SNTP_USER,
        pass: env_1.envVars.EMAIL_SENDER_SNTP_PASS
    },
    port: parseInt(env_1.envVars.EMAIL_SENDER_SNTP_PORT)
});
const sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
    try {
        const templatePath = node_path_1.default.resolve(process.cwd(), `src/app/template/${templateName}.ejs`);
        const html = await ejs_1.default.renderFile(templatePath, templateData);
        const info = await transporter.sendMail({
            from: env_1.envVars.EMAIL_SENDER_SNTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map((attachment) => ({
                filename: attachment.fileName,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        });
        console.log("email sent to", to, info.messageId);
    }
    catch (error) {
        console.log(error, "email send error");
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "email send error");
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map