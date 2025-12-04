import type { NextFunction, Request, Response } from 'express';
import jwt,{type JwtPayload} from 'jsonwebtoken';

export default function UserMiddleware(req:Request,res:Response,next:NextFunction){           
        if(!!req.cookies['token']){
            try {
                const result = <jwt.enrollStudentProps>jwt.verify(req.cookies['token'],process.env.JWT_SECRET!);
                if(!!result){
                    if(result.userId){
                        next();
                    }    
                    else{
                        return res.status(401).json({
                            success:false,
                            code:401,
                            data:"Unauthorised",
                        })
                    }   
                }else{
                    return res.status(401).json({
                        success:false,
                        code:401,
                        data:"Unauthorised"
                    })
                }
            } catch (error) {
                console.log(error,"Inside /admin middleware catch");
                return res.status(401).json({
                        success:false,
                        code:401,
                        data:"Unauthorised"
                })
            }
        }
        else{
            return res.status(401).json({
                        success:false,
                        code:401,
                        data:"Unauthorised"
                })
        }

}