import { Router } from "express";
import {studentInfoDB} from '../../config/db';
import { entryExitDB } from '../../config/dbEntryExit';
import "dotenv/config";
import type { enrollStudentProps } from "jsonwebtoken";
import jwt, { type JwtPayload } from 'jsonwebtoken';


const app = Router();

// student sends scan result
app.post("/api/scan", async (req, res) => {
    const { scannerId } = req.body;

    if(scannerId !== process.env.ADMIN_QR_SCANNER_ID){
        return res.status(400).json({
            success:false,
            message:"Invalid QR",
        })
    }
    
    if(req.cookies["token"]){
        console.log(req.cookies["token"],`req.cookies["token"]`);
        try {
            const result = <jwt.enrollStudentProps>jwt.verify(req.cookies["token"],process.env.JWT_SECRET!);
            console.log(result,"result");
             if(!result?.userId){
                return res.status(400).json({
                    success:false,
                    message:"Please Login !!",
                })
            }

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
            }

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