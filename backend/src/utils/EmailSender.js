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
            from: "WriterFlow <vinaydev19.projects@gmail.com>",
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

const sendWalcomeEmail = async (name, email) => {
    try {
        const res = await mailTransporter.sendMail({
            from: "WriterFlow <vinaydev19.projects@gmail.com>",
            to: email,
            subject: "Walcome to our WriterFlow community",
            text: "Walcome to our WriterFlow community",
            html: Welcome_Email_Template.replace("{name}", name)
        })
        console.log("walcome email is send successfully", res);
    } catch (error) {
        console.log(
            `something want wrong while send the walcome email || ${error}`
        );
    }
}

export {
    sendVerificationCode,
    sendWalcomeEmail
}