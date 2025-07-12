import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log(`Uploading file to Cloudinary: ${localFilePath}`);
        

        const res = await cloudinary.uploader.upload(localFilePath)

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        return res
    } catch (error) {
        console.log(`something want wrong while upload the image ${error}`);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath)
        }
        throw new Error("Cloudinary upload failed: " + error.message);
    }
}

export { uploadOnCloudinary }