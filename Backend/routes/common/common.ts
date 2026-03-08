import { Router } from "express";
import {studentInfoDB} from '../../config/db';
import "dotenv/config";
import type { enrollStudentProps } from "jsonwebtoken";
import jwt, { type JwtPayload } from 'jsonwebtoken';


const app = Router();

app.post('/login',async (req,res,next)=>{
    console.log(req.cookies,"req.cookies");
    const token = req.body.token ?? req.cookies['token'] 
       
    if(!!token){
        console.log(req.cookies,"req.cookies");
        try {
            const result = jwt.verify(token,process.env.JWT_SECRET!);
            if(!!result){
                return res.json({
                    success:!!result,
                    data: result,
                    message: !!result ? "login success" : "Invalid login",
                    token:token,
                    test:'check2'
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

    let {email,userId,expoToken} = req.body;
    // console.log({email,userId},"email,userId");

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

            if(expoToken){
                const signedExpoToken = jwt.sign(expoToken,process.env.JWT_SECRET!);
                 await studentInfoDB.student.update({
                    data:{
                        expoToken:signedExpoToken
                    },
                    where:{
                        email,userId
                    }
                });
            }else{
                console.log("Expo token is missing!")
            }      
        }
    } catch (error) {
        console.log(error,"Inside /listEnrollStudent catch");
        return res.status(500).json({
            success:false,
            data:"Invalid listEnrollStudent"
        })
    }

    if(!!result){
        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        res.setHeader("Surrogate-Control", "no-store");
        const jwtSigned = jwt.sign(result,process.env.JWT_SECRET!);
       res.cookie('token', jwtSigned, {
            maxAge: 24*60*60*1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
        return res.json({
        success:!!result,
        data: result,
        message: !!result ? "login success" : "Invalid login",
        token:jwtSigned,
        test:'check'
    })
    }

     return res.json({
        success:!!result,
        data: result,
        message: !!result ? "login success" : "Invalid login"
    })
})


app.post('/logout',(req,res,next)=>{
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