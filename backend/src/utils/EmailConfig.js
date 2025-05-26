import nodemailer from "nodemailer"

const mailTransporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "vinaydev19.projects@gmail.com",
        pass: "rzft iift mvsn umem"
    }
})

export { mailTransporter }