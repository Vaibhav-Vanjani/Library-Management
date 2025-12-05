import { Router } from "express";
import {studentInfoDB} from '../../config/db';
import { entryExitDB } from '../../config/dbEntryExit';
import "dotenv/config";
import type { enrollStudentProps } from "jsonwebtoken";
import jwt, { type JwtPayload } from 'jsonwebtoken';


const app = Router();

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

    if(!email || !userId){
        return res.status(400).json({
            success:false,
            message:"Please Fill Email and userId for Login !!",
        })
    }

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
       res.cookie('token', jwtSigned, {
            maxAge: 24*60*60*1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
    }

    return res.json({
        success:!!result,
        data: result,
        message: !!result ? "login success" : "Invalid login"
    })
})


app.get('/logout',(req,res,next)=>{
   res.clearCookie('token', {
        maxAge: 0,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    });

    return res.status(200).json({
        success:true,
        message:"Logout Success"
    })
})

export default app;