import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import "dotenv/config";
import adminRoutes from './routes/admin/admin';
import commonRoutes from './routes/common/common';
import userRoutes from './routes/user/user';
import UserMiddleware from './middleware/user';
import AdminMiddleware from './middleware/admin';

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.FRONTEND_URL,credentials: true}));

app.use('/admin',AdminMiddleware,adminRoutes);
app.use('/common',commonRoutes);
app.use('/user',UserMiddleware,userRoutes);

app.listen(PORT);