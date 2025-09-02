import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";
import {
  createBlog,
  deleteBlog,
  dislikeBlog,
  getAllBlogs,
  getMyTotalBlogLikes,
  getOwnBlogs,
  getPublishedBlog,
  likeBlog,
  togglePublishBlog,
  updateBlog,
} from "../controllers/blog.controller.js";

const router = express.Router();

// Handle multer errors
const handleFileUpload = (req, res, next) => {
  singleUpload(req, res, (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error",
      });
    }
    next();
  });
};

// Debug route to test file uploads
router.post("/test-upload", handleFileUpload, (req, res) => {
  console.log("Test upload route hit");
  console.log("Request file:", req.file);
  console.log("Request body:", req.body);
  return res.status(200).json({ success: true, message: "Upload test route" });
});

router.route("/").post(isAuthenticated, handleFileUpload, createBlog);
router.route("/:id").put(isAuthenticated, handleFileUpload, updateBlog);
router.route("/:id").patch(togglePublishBlog);
router.route("/get-all-blogs").get(getAllBlogs);
router.route("/get-published-blogs").get(getPublishedBlog);
router.route("/get-own-blogs").get(isAuthenticated, getOwnBlogs);
router.route("/delete/:id").delete(isAuthenticated, deleteBlog);
router.get("/:id/like", isAuthenticated, likeBlog);
router.get("/:id/dislike", isAuthenticated, dislikeBlog);
router.get("/my-blogs/likes", isAuthenticated, getMyTotalBlogLikes);

export default router;
