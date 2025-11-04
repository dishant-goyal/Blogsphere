import { v2 as cloudinary } from "cloudinary";

import fs from "fs"
import { ApiError } from "./apiError.js";


const uploadOnCloudinary=async(filePath,folder)=>{

    cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.CLOUD_API_KEY,
        api_secret:process.env.CLOUD_SECRET
    })

    
    try {
        if(!filePath){
            throw new ApiError(400,"File path is required")
        }

        const options={resourse_type:"auto"}
        if(folder){
            options.folder=folder;
        }

        const response=await cloudinary.uploader.upload(filePath,options)

        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }

        return response;

    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        console.error("Error while uploading file on Cloudinary:", error);
        // throw new ApiError(400,"Error in uplaoding the file")
        return null;
    }
}

export {uploadOnCloudinary}