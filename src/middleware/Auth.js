import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'

const verifyJWT=async(req,res,next)=>
{
    try
    {
        console.log("in auth");
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token)
            {
                res.status(400).json({"message":"unauthorized request"})
            }
        //console.log(token);
        const decodedData=jwt.verify(token,process.env.ACCESS_TOKEN_SECREAT);
        
        const user=await User.findById(decodedData?._id).select("-password -refreshToken");
        if(!user)
        {
            res.status(400).json({"message":"user unauthorized"});
        }

        console.log(user);
        req.user=user;
        next();

    }catch(err)
    {
        console.log("error in auth",err);
        res.status(500).json({"message":"Internal server error"});
    }
}

export default verifyJWT