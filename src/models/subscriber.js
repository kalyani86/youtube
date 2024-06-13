import mongoose, { Schema } from "mongoose";
const subscribeSchema=new Schema(
   {
        subscriber:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
        ,
        channel:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true

        }
        
   },
   {
    timestamps:true
   }
)

const Subscription=mongoose.model("subscribe",subscribeSchema);

export default Subscription;

