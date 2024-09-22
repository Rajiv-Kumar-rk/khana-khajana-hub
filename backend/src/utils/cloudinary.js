import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath)=> {
    try {
        if (!localFilePath) return null;
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        fs.unlinkSync(localFilePath); //remove the locally saved file
        return res;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the locally saved file incase of error
        return null;
    }
}