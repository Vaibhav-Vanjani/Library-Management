import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import "dotenv/config";
import adminRoutes from './routes/admin/admin';
import commonRoutes from './routes/common/common';
import userRoutes from './routes/user/user';
import UserMiddleware from './middleware/user';
import AdminMiddleware from './middleware/admin';
import './scheduler/scheduler';
import { entryExitDB } from './config/dbEntryExit';

const PORT = process.env.PORT;

const app = express();
app.set('etag', false);
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.FRONTEND_URL,credentials: true}));

try {
  app.use('/admin',AdminMiddleware,adminRoutes);
  app.use('/common',commonRoutes);
  app.use('/user',UserMiddleware,userRoutes);  
} catch (error) {
    console.log(error,"inside catch");
}


app.get('/checkvercel',(req,res)=>{
  res.json({
    success:true,
    message:"running",
  })
})

app.get("/api/reset-entry-exit", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).send("Unauthorized");
  }

  console.log("Entry exit reset running");

  try {
    await entryExitDB.entryExit.deleteMany({});
    res.status(200).send("done");
  } catch (error) {
    console.error(error);
    res.status(500).send("error");
  }

});

// export default app;
app.listen(PORT);