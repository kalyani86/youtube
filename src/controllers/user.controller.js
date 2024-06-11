import User from '../models/user.model.js';
import { uploadOnCloudnary } from '../utils/fileupload.js';
import jwt from 'jsonwebtoken';

const registerUser=async(req,res)=>
{
    try{
        //data from frontend
        const {username,email,fullname,password}=req.body;

        //check if all fields are present or not
        if(
            [username,email,fullname,password].some((field)=>field?.trim()==="")
        )
        {
            throw new Error("All field required");
        }
       
        //check if user already present or not;
        if(await User.findOne({email}))
        {
                throw new Error("user already present")
        }
        
        //check images
       // console.log("hi",req.files);
        
        const avatarLocalPath=req.files?.avatar[0]?.path;
       let coverImageLocalPath;
        if(req.files && req.files.coverImage && req.files.coverImage[0])
            {
                coverImageLocalPath=req.files.coverImage[0].path;
            }

        if(!avatarLocalPath)
            {
                throw new Error("avatar required");
            }
        //upload file on cloudnary
       const avatar=await uploadOnCloudnary(avatarLocalPath);
       
       const coverImage=await uploadOnCloudnary(coverImageLocalPath);
        
        if(!avatar)
            {
                throw new Error("avatar required");
            }

        //upload data on db

         console.log("before");
        const user=await User.create(
            {
                fullname,
                email,
                username,
                avatar:avatar.url,
                coverImage:coverImage?.url ||"",
                password
            }
        )
        console.log("after");
       console.log("user:",user);

        //check if user is created or not
        const createdUser=await User.findById(user._id).select("-password -refreshToken");
        if(!createdUser)
            {
                throw new Error("user not  created");
            }
        
            res.status(200).json({createdUser});
    }
    catch(err)
    {
        console.log("error in register",err);
        res.status(400).json({err});
    }
}

const loginUser=async(req,res)=>
    {
        try{
            //get data from frontend
            console.log(req.body);
            const {email,username,password}=req.body;

            //get user
           
            if(!username && !email)
            {
                res.status(400).json({"message":"Enter email or password"});
            }

            const user=await User.findOne({$or:[{username},{email}]});
            console.log(user);
            if(!user)
            {
                    res.status(404).json({"message":"user does not exit"});
            }
            //validate user
            
            const result=await user.ispasswordCorrect(password);
            console.log(result);
           // result? res.status(200).json({"message":"user login successfully"}):res.status(401).json({"message":"please enter correct password"});

            //generate access and refresh token  

            const accessToken=await user.generateAccessToken();
            const refreshToken=await user.generateRefreshToken();
           // console.log(accessToken,refreshToken);

             //save refresh token in db
            user.refreshToken=refreshToken;
            
            await user.save({validateBeforeSave:false});
            
            //send in cookies
            const options={
                httpOnly: true,        //server only
               // secure:true
            }
             
           
            return res
            .cookie('accessToken',accessToken,options)
            .cookie('refreshToken',refreshToken,options)
            .status(200)
            .json({"message":"login successfully","data":{user}});
            
         
        }
        catch(err)
        {
            console.log("error in login",err);
            if (!res.headersSent) {
                return res.status(500).json({ error: 'Internal server error' });
              }
        }
    }

const logout=async(req,res)=>
    {
        try{
            console.log("in logout");
            await User.findByIdAndUpdate(
                req.user?._id,
                {
                    $set:{
                        refreshToken:undefined
                    }
                }
                );
            const options={
                httpOnly:true,
                secure:true
            }
            
            return res
            .clearCookie('accessToken',options)
            .clearCookie('refreshToken',options)
            .status(200)
            .json({"message":"logout successfully"});

        }
        catch(err)
        {
            console.log(err);
            res.status(404).json({"message":"something went wrong"})
        }
    }

const refreshAccessToken=async(req,res)=>
    {
        try{

            //console.log("in refresh access token ",req.cookies)
            const incomingRefreshToken=res.cookies?.refreshToken || req.body.refreshToken || req.header("Authorization").replace("Bearer ","");
            if(!incomingRefreshToken)
                {
                    res.status(404).json({"message":"no refresh token"});
                }
                console.log(incomingRefreshToken)
                const decodedData=jwt.verify(incomingRefreshToken,process.env.REFRASH_TOKEN_SECREAT);

                const user=await User.findById(decodedData?._id);

                //console.log(user);
                if(!user)
                {
                    res.status(404).json({"message":"invalid refresh token"});
                }
                const actualRefreshToken=user?.refreshToken;
                console.log("actual:",actualRefreshToken);
                if(incomingRefreshToken!=actualRefreshToken)
                    {
                        res.status(404).json({"message":"user unauthorized or refresh token expired"});
                    }
                
                const accesstoken=await user.generateAccessToken();
                const refreshToken=await user.generateRefreshToken();
                const options={
                    httpOnly:true,
                    secure:true
                }

                res
                .cookie("accessToken",accesstoken,options)
                .cookie("refreshToken",refreshToken,options)
                .status(200)
                .json({"message":"access token modified"});

        }catch(err)
        {

            console.log("error in refresh access token",err);
        }
    } 


export { registerUser,loginUser,logout,refreshAccessToken};