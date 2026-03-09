import { Router } from "express";
import {studentInfoDB} from '../../config/db';
import { entryExitDB } from '../../config/dbEntryExit';
import "dotenv/config";
import type { enrollStudentProps } from "jsonwebtoken";
import jwt, { type JwtPayload } from 'jsonwebtoken';
import Mutex from "../../utils/lockthread";
import { notificationUtility } from "../../utils/sendPushNotificationUtils";

const lock = new Mutex();
const app = Router();

// student sends scan result
app.post("/api/scan", async (req, res,next) => {
    const { scannerId } = req.body;

    if(scannerId !== process.env.ADMIN_QR_SCANNER_ID){
        return res.status(400).json({
            success:false,
            message:"Invalid QR",
        })
    }

    const token = req.body.token ?? req.cookies["token"]
    
    if(token){
        console.log(token,`token`);
        try {
            const result = <jwt.enrollStudentProps>jwt.verify(token,process.env.JWT_SECRET!);
            console.log(result,"result");
             if(!result?.userId){
                return res.status(400).json({
                    success:false,
                    message:"Please Login !!",
                })
            }

           lock.run(async function () {
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
                            exitTime:Date.now().toString(),
                            isActive:true,
                            isPresent:!isEntryDone.isPresent,
                        }
                })
                    console.log("exit",exit);
                    notificationUtility(req,res,next,{title:"Scan Success",description:`Exit done by ${result.userId}`,email:result.reportsTo!});
            }
            else{
            const firstEntry = await entryExitDB.entryExit.create({
                    data:{
                        userId:result.userId,
                        entryTime:Date.now().toString(),
                        exitTime: Date.now().toString(),
                        currentDate:Date.now().toString(),
                        isActive:true,
                        isPresent:true,
                    }
                })
                console.log("firstEntry",firstEntry);
               notificationUtility(req,res,next,{title:"Scan Success",description:`Entry done by ${result.userId}`,email:result.reportsTo!});
            }
           }) 
            return res.json({ success: true });
        } catch (error) {
            console.log(error,"error message::");
            return res.json({ success: false });
        }   
    }
    console.log("No cookies present");
   return res.json({ success: false });
});

export default app;