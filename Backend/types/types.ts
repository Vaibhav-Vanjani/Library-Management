import jwt, { type JwtPayload } from 'jsonwebtoken';

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

export interface sendEmailProps{
    to:string,
    subject:string,
    text:string,
}