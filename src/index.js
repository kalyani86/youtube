import dotenv from "dotenv";
import connectDB from './db/connection.js';
import {app} from "./app.js";

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>
{
    app.on("error",(err)=>
    {
        console.log("error")
    })
    app.listen(process.env.PORT || 1000,()=>
    {
        console.log(`app listening on port ${process.env.PORT}`);
    })
})
.catch((err)=>
{
    console.log("error in db connection")
})
