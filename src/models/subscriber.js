import mongoose, { Schema } from "mongoose";

const subscribeSchema=new Schema(
   {
        subscribe:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
        ,
        channel:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
        
   },
   {
    timestamps:true
   }
)

const subscription=mongoose.model("subscribe",subscribeSchema);
export default subscription;