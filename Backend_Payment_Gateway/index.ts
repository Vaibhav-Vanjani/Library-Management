import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { instance } from './config/Razorpay';
import Razorpay from 'razorpay';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils.js';
import {studentInfoDB} from './config/db';

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "http://localhost:3000",
  credentials: true}));



app.post('/api/v1/payment',async (req,res,next)=>{
    const {months,locker,Total_payment} = req.body;
    console.log(req.body,"{months,locker,Total_payment}");

    var options = {
        amount: Total_payment*100,  // Amount is in currency subunits. 
        currency: "INR",
        receipt: Date.now().toString()
    };

    let payment_order = {};
    try {
        instance.orders.create(options, function(err, order) {
        console.log(order,"order");
        if(err){
            res.status(500).json({
                success:false,
                message:err
            })
        }
        payment_order = order;
           return res.json({
            success:true,
            data:payment_order
        })
    });
    } catch (error) {
        console.log(error,"Invalid order");
        res.status(500).json({
                success:false,
                message:"Invalid order"
        })
    }
    
    
})

app.post('/api/v1/verify-payment',async (req,res,next)=>{
    const {razorpay_payment_id,razorpay_order_id,razorpay_signature,order_id,userId,payment,expiresAt} = req.body;
    console.log({razorpay_payment_id,razorpay_order_id,razorpay_signature,order_id,userId,payment,expiresAt},"{razorpay_payment_id,razorpay_order_id,razorpay_signature,order_id,userId");

    if(!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !order_id || !userId || !payment || !expiresAt){
       return res.status(400).json({
            success:false,
            message:"Payment Failure - I"
        })
    }

    const verifySignature = validatePaymentVerification({"order_id": order_id, "payment_id": razorpay_payment_id }, razorpay_signature, process.env.RAZORPAY_KEY_SECRET!);

    if(!verifySignature){
       return res.status(400).json({
            success:false,
             message:"Payment Failure - II"
        })
    }

    try {
        const transaction = await studentInfoDB.$transaction(async(tx)=>{
            await Promise.all([tx.payment.create({
                data:{
                    razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature,
                    order_id,userId,
                    payment,expiresAt
                }   
            }),await tx.student.update({
                where:{
                    userId,
                },
                data:{
                    payment:payment,
                    expiresAt:expiresAt,
                    expiryUpdated:true,
                }
            })])
    },{
    maxWait: 5000, // default: 2000
  })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Issue in saving data"
        })  
    }
    
    return res.status(200).json({
        success:true,
        data:{
            "payment":"verified",
        }
    })
})


app.listen(PORT);
