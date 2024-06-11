import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    //
}));

app.use(express.json({limit:"2kb"}))
app.use(express.urlencoded({extended:true,limit:"2kb"}));
app.use(express.static("public"));


app.use(cookieParser());


///user routes
import userRouter from './routes/user.routes.js';

app.use('/api/v1/users',userRouter);




export {app};