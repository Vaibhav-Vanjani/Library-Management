import {studentInfoDB} from '../config/db';
import { entryExitDB } from '../config/dbEntryExit';
import "dotenv/config";
import cron from 'node-cron';
import type { enrollStudentProps } from '../types/types';
import { BEST_ACHIVERS_EXPIRY_SCHEDULED_SUBJECT,BEST_ACHIVERS_EXPIRY_SCHEDULED_TEXT } from '../constants/constants';
import {sendEmail} from '../utils/emailutils';

cron.schedule(process.env.CRON_EXPIRY_RUN_TIME!,async function(){
    console.log("Hi i run every day at 2:00 pm");
    let result:enrollStudentProps[];
    // run scheduler every day 
    // current day + 3 > expiry then send a email 
    try {
        result = await studentInfoDB.student.findMany({
            where:{
                expiresAt:{
                    lt: BigInt(Date.now() + 3*24*60*60*1000)
                }
            }
        });

        if(result.length === 0){
            console.log("No Email Triggered as there is no expired student !!");
            return ;
        }

    } catch (error) {
        console.log(error,"Inside /defaulter catch");
        return;
    }

    const subject = BEST_ACHIVERS_EXPIRY_SCHEDULED_SUBJECT;
    let to = "";
    result.forEach((student)=>{
        to += student.email + ",";
    })
    to.slice(0,to.length-1);
    const text = BEST_ACHIVERS_EXPIRY_SCHEDULED_TEXT;
    sendEmail({to,subject,text});
})

cron.schedule(process.env.CRON_ENTRY_EXIT_REFRESH!,async function() {
    console.log("Hi i am inside - entry exit reset");
    try {
        await entryExitDB.entryExit.deleteMany({});
    } catch (error) {
        console.log(error," inside - entry exit reset");
    }
})