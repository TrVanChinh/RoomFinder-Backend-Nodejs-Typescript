import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();
    // Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (filePath: string, folder: string) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: folder,       
            resource_type: 'auto'
          });
        return { url: uploadResult.url }; // Trả về URL của ảnh đã upload
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

