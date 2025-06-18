import dotenv from "dotenv"
dotenv.config({
    path: '.env'
})
import nodemailer from "nodemailer"

const mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export { mailTransporter }