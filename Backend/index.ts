import express from 'express';
import {prisma} from './config/db';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import "dotenv/config";

interface enrollStudentProps{
    id:number,
    userId:string,
    email:string,
    fullName:string,
    payment:string,
    enrolledAt:bigint | null,
    expiresAt:bigint | null | string,
    isAdmin:boolean
    phoneNumber:string | null,
}


const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res, next) => {
    return res.json({ "success": "Hi there in Backend" });
});

app.post('/enrollStudent', async (req, res, next) => {
    const { userId, email, fullName, payment , enrolledAt , expiresAt, phoneNumber } = req.body;
    console.log({ userId, email, fullName, payment },"{ userId, email, fullName, payment }");
    let result:enrollStudentProps;
    try {
        result = await prisma.student.create({
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
        data: result,
        message:"success"
    })
});

app.get('/listEnrollStudent', async (req, res, next) => {
    let result:enrollStudentProps[];
    try {
        result = await prisma.student.findMany({});
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

app.get('/login',async (req,res,next)=>{
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
    let result:enrollStudentProps | null;
    try {
        result = await prisma.student.findFirst({
            where:{
                email,userId
            }
        });
    } catch (error) {
        console.log(error,"Inside /listEnrollStudent catch");
        return res.status(500).json({
            success:false,
            data:"Invalid listEnrollStudent"
        })
    }

    if(!!result){
        const jwtSigned = jwt.sign(result,process.env.JWT_SECRET!);
        res.cookie('token',jwtSigned,{ expires: new Date(Date.now() + 60*1000), httpOnly: true })
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
        result = await prisma.student.findMany({
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

app.listen(3000);