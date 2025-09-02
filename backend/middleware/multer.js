import multer from "multer";

const storage = multer.memoryStorage();

// Filter for allowed file types
const fileFilter = (req, file, cb) => {
  // Accept only jpg, jpeg, png
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG files are allowed"), false);
  }
};

// Configure multer with storage, limits, and fileFilter
export const singleUpload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max file size
  },
  fileFilter,
}).single("file");
