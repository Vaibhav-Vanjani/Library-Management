import { Request,Response,NextFunction } from "express";
import jwt, { type enrollStudentProps } from 'jsonwebtoken';
import {studentInfoDB} from '../config/db';

export async function sendExpoPushNotification({
  expoTokenList,
  title,
  description
}: {
  expoTokenList: string[];
  title: string;
  description: string;
}) {

  const url = "https://exp.host/--/api/v2/push/send";

  for (const expoToken of expoTokenList) {
    console.log(expoToken, title, description, "for loop");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: expoToken,
          title,
          body: description,
          sound: "default"
        })
      });

      const data = await res.json();
      console.log("expo response:", data);

      console.log(
        url,
        expoToken,
        title,
        description,
        "inside send push notification utils",
        data
      );

    } catch (error) {
      console.log("Error while sending push notification!!", error);
    }
  }
}

export async function notificationUtility(req:Request,res:Response,next:NextFunction,requestObj:{title:string,description:string} | null){
  let { email,title,description } = req.body;

    if(requestObj){
      title = requestObj.title;
      description = requestObj.description;
    }
  
    console.log({ email,title,description },"{ email,title,description }");
      let result:enrollStudentProps | null;
      try {
          result = await studentInfoDB.student.findFirst({
          where:{
              email
              }
          });
  
          if(result?.expoToken){
              try {
                  const expoToken = jwt.verify(result.expoToken,process.env.JWT_SECRET!);
                  console.log(expoToken,"______expotoken",result.expoToken,"______result.expotoken");
                 await sendExpoPushNotification({expoTokenList:[expoToken as string],title,description});
              } catch (error) {
                  console.log("Error while /sendPushNotification", error);
                   return res.status(500).json({
                      success:false,
                      message:"Issue while verifying token!"
                  })
              }
          }
          else{
              return res.status(500).json({
                  success:false,
                  message:"Token Missing"
              })
          }
  
      } catch (error) {
          return res.status(500).json({
              success:false,
              data:"Invalid Details"
          })
      }
      return res.json({
          success:true,
          message:"success"
      })
}