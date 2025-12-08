import { Request, Router } from "express";
import {studentInfoDB} from '../../config/db';
import { entryExitDB } from '../../config/dbEntryExit';
import "dotenv/config";
import type { enrollStudentProps } from "jsonwebtoken";
import Mutex from "../../utils/lockthread";
import cloudinary from "../../config/cloudinary";
import multer from "multer";
import streamifier from 'streamifier';
import {UploadApiResponse,UploadApiErrorResponse} from 'cloudinary';


const fileUpload = multer();
const lock = new Mutex();
const app = Router();

app.post('/enrollStudent', async (req, res, next) => {
    const { userId, email, fullName, payment , 
            enrolledAt , expiresAt, phoneNumber, 
            aadharCardNumber, profilePic} = req.body;
    console.log({ userId, email, fullName, payment , enrolledAt , expiresAt, phoneNumber, 
            aadharCardNumber, profilePic},"{ userId, email, fullName, payment }");
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
            isAdmin:false,
            aadharCardNumber,
            profilePic,
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
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.set('Surrogate-Control', 'no-store');

        return res.status(500).json({
            success:false,
            data:"Invalid listEnrollStudent"
        })
    }
     res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
     res.set('Pragma', 'no-cache');
     res.set('Expires', '0');
     res.set('Surrogate-Control', 'no-store');
    return res.json({
        success:true,
        data: result,
        message:"success"
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
        enrolledAt: student.enrolledAt ? student.enrolledAt.toString() : null,
        }));
    } catch (error) {
        console.log(error,"Inside /defaulter catch");
        return res.status(500).json({
            success:false,
            data:"Invalid listEnrollStudent"
        })
    }
     res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
     res.set('Pragma', 'no-cache');
     res.set('Expires', '0');
     res.set('Surrogate-Control', 'no-store');
    return res.json({
        success:true,
        data: result,
        message:"success"
    })
})

// A2 polls here
app.get("/api/check-scan",async (req, res) => {
     try {

            const paymentDone =  await studentInfoDB.student.findMany({
                where:{
                    expiryUpdated:true
                }
            });

            await studentInfoDB.student.updateMany({
                where:{
                    expiryUpdated:true
                },
                data:{
                    expiryUpdated:false
                }
            });

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
            
            if(!(result?.length) && !(paymentDone?.length)){
                return res.json({ success: false });
            }
            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
            res.set('Surrogate-Control', 'no-store');
             return res.json({ success: true , scannedBy: result , paymentDone });
        } catch (error) {
             console.error(error,"Inside catch fn error !!");
             return res.json({ success: false });
        }
   
});

app.get('/api/entryExitView',async function (req,res,next) {
        
        try {
             const result = await entryExitDB.entryExit.findMany({
                where:{
                    isActive:false,
                }
            });

            res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
            res.set('Surrogate-Control', 'no-store');
            return res.status(200).json({
                success:true,
                data:result,
            })

        } catch (error) {
            console.log(error,"Inside entryExit View catch Fn");
            return res.status(500).json({
                success:false,
                message:"Something Went Wrong While Entry Exit View",
            })
        }      
})


app.post('/api/v1/searchStudent',async (req,res,next)=>{

    const {searchFor,searchOption} = req.body;
    console.log({searchFor,searchOption},"{searchFor,searchOption}");

    if(!searchFor || !searchOption){
        return res.status(400).json({
            success:false,
            message:"Invalid search data",
        })
    }

    try {
        let result = await studentInfoDB.student.findMany({
            where:{
                [searchOption]:{
                    contains: searchFor
                }
            }
        }) 

         const searchedStudent = result.map(student => ({
            ...student,
            expiresAt: student.expiresAt ? student.expiresAt.toString() : null,
            enrolledAt: student.enrolledAt ? student.enrolledAt.toString() : null,    
            }));

        res.status(200).json({
            success:true,
            data:searchedStudent,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Issue in getting student",
        })
    }
})

app.post('/uploadPic',fileUpload.single('file'),async (req,res,next)=>{

    const file = req.file;

    if(!file){
        return res.status(400).json({
            succes:false,
            message:"Please upload again",
        })
    }

    let url = "";
    try {
    url = await lock.run(async () => {
        function streamUpload(req: Request): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
            );

            streamifier.createReadStream(req.file!.buffer).pipe(stream);
        });
        }

        async function upload(req: Request): Promise<string> {
            const result = await streamUpload(req);
            console.log(result, "upload response from cloudinary");
            return result.secure_url;
        }

        return upload(req); 
    });

    // now url contains secure_url
    console.log("Final URL:", url);

    const response = {
        success: true,
        url
    };

    res.json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Upload failed", details: err });
    }
})

export default app;