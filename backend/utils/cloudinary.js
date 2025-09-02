import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables before importing modules that use them
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("Cloudinary configuration:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Not set",
  api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Not set",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set",
});

try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary configured successfully");
} catch (error) {
  console.error("Error configuring Cloudinary:", error);
}

export default cloudinary;
