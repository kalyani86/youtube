import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUDARY_NAME,
    api_key: process.env.CLOUDARY_API_KEY, 
    api_secret: process.env.CLOUDNARY_API_SECRET 
});

const uploadOnCloudnary=async (localFilePath)=>{
    try 
    {
        if(!localFilePath)
            {
                return null
            }

             const res=await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto",
                }
            )

            console.log("cloudnary res ",res);
            return res;
        
    } 
    catch (error) {
        //remove file link from server
        fs.unlinkSync(localFilePath);
        return null;
    }
}


export {uploadOnCloudnary};