import { createTransport } from "nodemailer";

export const mailTransport = createTransport({
    host: process.env.SMTP_EMAIL,
    port: 2525,
    secure: false, 
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});