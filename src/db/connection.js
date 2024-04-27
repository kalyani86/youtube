import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB=async()=>
{
    try{
        const db=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(db.connection.host);
        console.log("successfully connected to db");
    }
    catch(err)
    {
        console.log("error in db connection :",err);
        throw err;
    }
}


export default connectDB;