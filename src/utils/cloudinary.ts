import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!, // Cloud name from your Cloudinary dashboard
  api_key: process.env.CLOUDINARY_API_KEY!, // API key from your Cloudinary dashboard
  api_secret: process.env.CLOUDINARY_API_SECRET!, // API secret from your Cloudinary dashboard
  secure:true
});

export default cloudinary;
