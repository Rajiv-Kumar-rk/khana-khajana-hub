import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadOnCloudinary = async (localFilePath, isImageUploadedByUser)=> {
    try {
        if (!localFilePath) throw new Error("'localFilePath' is empty");
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        if (isImageUploadedByUser) fs.unlinkSync(localFilePath); //remove the locally saved file
        return res;
    } catch (error) {
        console.log(error);
        if (isImageUploadedByUser) fs.unlinkSync(localFilePath); //remove the locally saved file incase of error
        return null;
    }
}