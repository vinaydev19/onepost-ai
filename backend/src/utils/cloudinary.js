import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    account_id: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secre: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const res = await cloudinary.uploader.upload(localFilePath)

        fs.unlinkSync(localFilePath)
        return res
    } catch (error) {
        console.log(`something want wrong while upload the image ${error}`);
        fs.unlinkSync(localFilePath)
        return error
    }
}

export { uploadOnCloudinary }