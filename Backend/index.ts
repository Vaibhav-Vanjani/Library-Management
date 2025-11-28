import express, { text } from 'express';
import {studentInfoDB} from './config/db';
import { entryExitDB } from './config/dbEntryExit';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import "dotenv/config";
import cron from 'node-cron';
import nodemailer from 'nodemailer';

declare module 'jsonwebtoken' {
    export interface enrollStudentProps extends jwt.JwtPayload{
    id:number,
    userId:string,
    email:string,
    fullName:string,
    payment:string,
    enrolledAt:bigint | null | string,
    expiresAt:bigint | null | string,
    isAdmin:boolean
    phoneNumber:string | null,
}
}

interface enrollStudentProps extends jwt.JwtPayload{
    id:number,
    userId:string,
    email:string,
    fullName:string,
    payment:string,
    enrolledAt:bigint | null | string,
    expiresAt:bigint | null | string,
    isAdmin:boolean
    phoneNumber:string | null,
}

interface sendEmailProps{
    to:string,
    subject:string,
    text:string,
}

const BEST_ACHIVERS_EXPIRY_SCHEDULED_SUBJECT = "Best Achivers | Notification For Expiring 3 Days Left";
const BEST_ACHIVERS_EXPIRY_SCHEDULED_TEXT =`Your access will expire in 3 days. Please visit : <a href="">Link</a>`
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "http://localhost:3000",
  credentials: true}));

app.get('/', (req, res, next) => {
    return res.json({ "success": "Hi there in Backend" });
});

app.post('/enrollStudent', async (req, res, next) => {
    const { userId, email, fullName, payment , enrolledAt , expiresAt, phoneNumber } = req.body;
    console.log({ userId, email, fullName, payment },"{ userId, email, fullName, payment }");
    let result:enrollStudentProps;
    try {
        result = await studentInfoDB.student.create({
        data: {
            userId,
            email,
            fullName,
            payment,
            phoneNumber,
            enrolledAt,
            expiresAt,
            isAdmin:false
        }
    });
    } catch (error) {
        console.log(error,"Inside /enrollStudent catch");
        return res.status(500).json({
            success:false,
            data:"Invalid Details"
        })
    }
    return res.json({
        success:true,
        // data: result,
        message:"success"
    })
});

app.get('/listEnrollStudent', async (req, res, next) => {
    let result:enrollStudentProps[];
    try {
        result = await studentInfoDB.student.findMany({});
         result = result.map(student => ({
        ...student,
        expiresAt: student.expiresAt ? student.expiresAt.toString() : null,
        enrolledAt: student.enrolledAt ? student.enrolledAt.toString() : null,    
        }));
    } catch (error) {
        console.log(error,"Inside /listEnrollStudent catch");
        return res.status(500).json({
            success:false,
            data:"Invalid listEnrollStudent"
        })
    }
    return res.json({
        success:true,
        data: result,
        message:"success"
    })
})

app.post('/login',async (req,res,next)=>{
     console.log(req.cookies,"req.cookies");
       
    if(!!req.cookies['token']){
        console.log(req.cookies,"req.cookies");
        try {
            const result = jwt.verify(req.cookies['token'],process.env.JWT_SECRET!);
            if(!!result){
                return res.json({
                    success:!!result,
                    data: result,
                    message: !!result ? "login success" : "Invalid login"
                })
            }
        } catch (error) {
            console.log(error,"Inside /login cookie catch");
            return res.status(500).json({
                success:false,
                data:"Invalid /login cookie"
            })
        }
    }

    let {email,userId} = req.body;
    console.log({email,userId},"email,userId");
    let result:enrollStudentProps | null;
    try {
        result = await studentInfoDB.student.findFirst({
            where:{
                email,userId
            }
        });
        if(result){
            result.expiresAt = result.expiresAt!.toString();
            result.enrolledAt = result.enrolledAt!.toString();   
        }
    } catch (error) {
        console.log(error,"Inside /listEnrollStudent catch");
        return res.status(500).json({
            success:false,
            data:"Invalid listEnrollStudent"
        })
    }

    if(!!result){
        const jwtSigned = jwt.sign(result,process.env.JWT_SECRET!);
        res.cookie('token',jwtSigned,{ expires: new Date(Date.now() + 60*60*1000), httpOnly: true })
        // console.log(jwtSigned,"jwtsigned");
        // console.log(res,"res");
    }

    return res.json({
        success:!!result,
        data: result,
        message: !!result ? "login success" : "Invalid login"
    })
})

app.get('/defaulter',async (req,res,next) => {
    
    console.log("i am in defaulter",Date.now());
    let result:enrollStudentProps[];
    try {
        result = await studentInfoDB.student.findMany({
            where:{
                expiresAt:{
                    lt: BigInt(Date.now())
                }
            }
        });

        result = result.map(student => ({
        ...student,
        expiresAt: student.expiresAt ? student.expiresAt.toString() : null,
        }));
    } catch (error) {
        console.log(error,"Inside /defaulter catch");
        return res.status(500).json({
            success:false,
            data:"Invalid listEnrollStudent"
        })
    }
    return res.json({
        success:true,
        data: result,
        message:"success"
    })
})

function sendEmail({to,subject,text}:sendEmailProps){
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

cron.schedule(process.env.CRON_EXPIRY_RUN_TIME!,async function(){
    console.log("Hi i run every day at 2:00 pm");
    let result:enrollStudentProps[];
    // run scheduler every day 
    // current day + 3 > expiry then send a email 
    try {
        result = await studentInfoDB.student.findMany({
            where:{
                expiresAt:{
                    lt: BigInt(Date.now() + 3*24*60*60*1000)
                }
            }
        });

        if(result.length === 0){
            console.log("No Email Triggered as there is no expired student !!");
            return ;
        }

    } catch (error) {
        console.log(error,"Inside /defaulter catch");
        return;
    }

    const subject = BEST_ACHIVERS_EXPIRY_SCHEDULED_SUBJECT;
    let to = "";
    result.forEach((student)=>{
        to += student.email + ",";
    })
    to.slice(0,to.length-1);
    const text = BEST_ACHIVERS_EXPIRY_SCHEDULED_TEXT;
    sendEmail({to,subject,text});
})

// TEMP STORAGE (use DB in production)
let scanEvents:any = {};  
// Format: scanEvents[scannerId] = scannedByUserDetails;

// A1 sends scan result
app.post("/api/scan", async (req, res) => {
    const { scannerId, scannedBy } = req.body;
    if(req.cookies["token"]){
        console.log(req.cookies["token"],`req.cookies["token"]`);
        try {
            const result = <jwt.enrollStudentProps>jwt.verify(req.cookies["token"],process.env.JWT_SECRET!);
            console.log(result,"result");

           const isEntryDone = await entryExitDB.entryExit.findFirst({
                where:{
                   userId:result.userId,
                }
            })

            console.log("isEntryDone",isEntryDone);

            if(!!isEntryDone){
                const exit = await entryExitDB.entryExit.update({
                    where:{
                        userId:result.userId
                    },
                    data:{
                        exitTime:Date.now().toString()
                    }
                })

                console.log("exit",exit);
            }
            else{
                const firstEntry = await entryExitDB.entryExit.create({
                    data:{
                        userId:result.userId,
                        entryTime:Date.now().toString(),
                        exitTime: Date.now().toString(),
                        currentDate:Date.now().toString(),
                        isActive:true
                    }
                })
                console.log("firstEntry",firstEntry);
            }

            return res.json({ success: true });
        } catch (error) {
            console.log(error,"error message::");
        }   
    }
    console.log("No cookies present");
   return res.json({ success: false });
});

// A2 polls here
app.get("/api/check-scan/:scannerId",async (req, res) => {
    try {
        try {
            
            const result = await entryExitDB.entryExit.findMany({
                where:{
                    isActive:true
                }
            });
           
            await entryExitDB.entryExit.updateMany({
                where:{
                    isActive:true
                },
                data:{
                    isActive:false
                }
            });
            

            if((!result)){
                throw Error("Nothing Scanned !!");
            }
    
             return res.json({ success: true , scannedBy: result });
        } catch (error) {
             return res.json({ success: false });
        }

       
    } catch (error) {
        return res.json({ success: false });
    }
   
});




app.listen(PORT);