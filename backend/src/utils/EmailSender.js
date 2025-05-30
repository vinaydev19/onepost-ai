import { mailTransporter } from "./EmailConfig.js"
import {
    Verification_Email_Template,
    Welcome_Email_Template,
    Reset_Password_Email_Template,
    Password_Reset_Confirmation_Email,
    Email_Change_Verification_Template,
    Email_Change_Confirmation_Email
} from "./EmailTemp.js"


const sendVerificationCode = async (email, verificationCode) => {
    try {
        const res = await mailTransporter.sendMail({
            from: "onePost AI <vinaydev19.projects@gmail.com>",
            to: email,
            subject: "Verify Your Email",
            text: "verify Your Email",
            html: Verification_Email_Template.replace("{verificationCode}", verificationCode)
        })
        console.log("verifycaion code send successfully", res);
    } catch (error) {
        console.log(
            `something want wrong while send the verification code || ${error}`
        );
    }
}

const sendWelcomeEmail = async (name, email) => {
    try {
        const res = await mailTransporter.sendMail({
            from: "onePost AI <vinaydev19.projects@gmail.com>",
            to: email,
            subject: "Walcome to our onePost AI community",
            text: "Walcome to our onePost AI community",
            html: Welcome_Email_Template.replace("{name}", name)
        })
        console.log("walcome email is send successfully", res);
    } catch (error) {
        console.log(
            `something want wrong while send the walcome email || ${error}`
        );
    }
}

const resetPasswordTokenSent = async (email, link) => {
    try {
        const res = await mailTransporter.sendMail({
            from: "onePost AI <vinaydev19.projects@gmail.com>",
            to: email,
            subject: "reset password link",
            text: "reset password link",
            html: Reset_Password_Email_Template.replace("{link}", link)
        })
        console.log("reset pasword link is send successfully", res);
    } catch (error) {
        console.log(
            `something want wrong while send the reset pasword || ${error}`
        );
    }
}


const resetPasswordConfirmationEmail = async (name, email) => {
    try {
        const res = await mailTransporter.sendMail({
            from: "onePost AI <vinaydev19.projects@gmail.com>",
            to: email,
            subject: "Reset pasword confirmation our onePost AI community",
            text: "Reset pasword confirmation our onePost AI community",
            html: Password_Reset_Confirmation_Email.replace("{name}", name)
        })
        console.log("reset pasword confirmation is send successfully", res);
    } catch (error) {
        console.log(
            `something want wrong while send the reset pasword confirmation || ${error}`
        );
    }
}


export {
    sendVerificationCode,
    sendWelcomeEmail,
    resetPasswordTokenSent,
    resetPasswordConfirmationEmail
}