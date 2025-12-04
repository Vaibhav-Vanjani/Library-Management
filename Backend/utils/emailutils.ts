import "dotenv/config";
import nodemailer from 'nodemailer';
import type { sendEmailProps } from '../types/types';


export function sendEmail({to,subject,text}:sendEmailProps){
    let mailTransporter = nodemailer.createTransport({
        service:process.env.NODE_MAILER_SERVICE,
        auth:{
            user:process.env.NODE_MAILER_AUTH_USER,
            pass:process.env.NODE_MAILER_AUTH_PASS,
        }
    });

    let mailDetails = {
        from:process.env.NODE_MAILER_MAIL_DETAILS_FROM,
        to,
        subject,
        text,
    }

    mailTransporter.sendMail(mailDetails,function(err,data){
            if(err){
                console.log(err,"FAILL");
            }
            else{
                console.log(data,'Successs');
            }
    })
}