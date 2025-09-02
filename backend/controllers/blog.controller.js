import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, subtitle, description, category } = req.body;
    const file = req.file;

    console.log("Create blog request:", { title, category });
    console.log("File included:", file ? file.originalname : "No file");

    if (!title || !category) {
      return res.status(400).json({
        message: "Blog title and category is required.",
      });
    }

    // Create the blog data object
    const blogData = {
      title,
      subtitle,
      description,
      category,
      author: req.id,
    };

    // Handle thumbnail upload if a file is included
    if (file) {
      try {
        console.log("Processing file upload for:", file.originalname);

        // Check file type again (extra validation)
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: "Invalid file type. Only JPG, JPEG, PNG files are allowed",
          });
        }

        const fileUri = getDataUri(file);
        console.log("File URI generated successfully");

        console.log("Uploading to Cloudinary...");
        const uploadResult = await cloudinary.uploader.upload(fileUri, {
          folder: "blog_thumbnails",
          resource_type: "image",
          format: "jpg", // Convert all images to jpg format
          transformation: [
            { width: 800, height: 600, crop: "limit" }, // Resize to reasonable dimensions
            { quality: "auto:good" }, // Optimize quality
          ],
        });

        // Store the secure URL from Cloudinary
        blogData.thumbnail = uploadResult.secure_url;
        console.log(
          "Thumbnail uploaded successfully to Cloudinary:",
          uploadResult.secure_url
        );
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
          error: uploadError.message,
        });
      }
    }

    const blog = await Blog.create(blogData);

    return res.status(201).json({
      success: true,
      blog,
      message: "Blog Created Successfully.",
    });
  } catch (error) {
    console.error("Failed to create blog:", error);
    return res.status(500).json({
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log("Update blog request for ID:", blogId);
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { title, subtitle, description, category } = req.body;
    const file = req.file;

    let blog = await Blog.findById(blogId).populate("author");
    if (!blog) {
      console.log("Blog not found with ID:", blogId);
      return res.status(404).json({
        message: "Blog not found!",
      });
    }

    console.log("Found blog:", blog.title);

    // Create the update data object with all fields from the request
    const updateData = {
      title,
      subtitle,
      description,
      category,
      author: req.id,
    };

    console.log("Update data:", updateData);

    // Only update the thumbnail if a new file is uploaded
    if (file) {
      try {
        console.log("Processing file upload for:", file.originalname);

        // Check file type again (extra validation)
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: "Invalid file type. Only JPG, JPEG, PNG files are allowed",
          });
        }

        const fileUri = getDataUri(file);
        console.log("File URI generated successfully");

        console.log("Uploading to Cloudinary...");
        const uploadResult = await cloudinary.uploader.upload(fileUri, {
          folder: "blog_thumbnails",
          resource_type: "image",
          format: "jpg", // Convert all images to jpg format
          transformation: [
            { width: 800, height: 600, crop: "limit" }, // Resize to reasonable dimensions
            { quality: "auto:good" }, // Optimize quality
          ],
        });

        // Store the secure URL from Cloudinary
        updateData.thumbnail = uploadResult.secure_url;
        console.log(
          "Thumbnail uploaded successfully to Cloudinary:",
          uploadResult.secure_url
        );
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
          error: uploadError.message,
        });
      }
    }

    blog = await Blog.findByIdAndUpdate(blogId, updateData, { new: true });
    console.log("Blog updated successfully:", blog.title);

    res
      .status(200)
      .json({ success: true, message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating blog",
        error: error.message,
      });
  }
};

export const getAllBlogs = async (_, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "firstName lastName photoUrl",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "userId",
          select: "firstName lastName photoUrl",
        },
      });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching blogs",
        error: error.message,
      });
  }
};

export const getPublishedBlog = async (_, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "firstName lastName photoUrl" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "userId",
          select: "firstName lastName photoUrl",
        },
      });
    if (!blogs) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get published blogs",
    });
  }
};

export const togglePublishBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { publish } = req.query; // true, false
    console.log("Toggle publish request:", req.query, "for blog ID:", blogId);

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found!",
      });
    }
    // publish status based on the query parameter
    blog.isPublished = !blog.isPublished;
    console.log("Updating publish status to:", blog.isPublished);

    await blog.save();

    const statusMessage = blog.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Blog is ${statusMessage}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

export const getOwnBlogs = async (req, res) => {
  try {
    const userId = req.id; // Assuming `req.id` contains the authenticated user’s ID

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const blogs = await Blog.find({ author: userId })
      .populate({
        path: "author",
        select: "firstName lastName photoUrl",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "userId",
          select: "firstName lastName photoUrl",
        },
      });

    if (!blogs) {
      return res
        .status(404)
        .json({ message: "No blogs found.", blogs: [], success: false });
    }

    return res.status(200).json({ blogs, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: error.message });
  }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    if (blog.author.toString() !== authorId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this blog" });
    }

    // Delete blog
    await Blog.findByIdAndDelete(blogId);

    // Delete related comments
    await Comment.deleteMany({ postId: blogId });

    res
      .status(200)
      .json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting blog",
        error: error.message,
      });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.id;

    console.log(`Like request for blog ${blogId} from user ${userId}`);

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if user already liked the blog
    const alreadyLiked = blog.likes.includes(userId);
    if (alreadyLiked) {
      return res.status(200).json({
        success: true,
        message: "Blog already liked",
        blog,
      });
    }

    // Add user to likes array
    blog.likes.push(userId);
    await blog.save();

    console.log(`Blog ${blogId} liked by user ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Blog liked successfully",
      blog,
    });
  } catch (error) {
    console.error("Error in likeBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Error liking blog",
      error: error.message,
    });
  }
};

export const dislikeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.id;

    console.log(`Dislike request for blog ${blogId} from user ${userId}`);

    if (!blogId) {
      return res.status(400).json({
        success: false,
        message: "Blog ID is required",
      });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Check if the user has liked the blog
    const hasLiked = blog.likes.includes(userId);
    if (!hasLiked) {
      return res.status(200).json({
        success: true,
        message: "Blog was not liked by this user",
        blog,
      });
    }

    // Remove user from likes array
    blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    await blog.save();

    console.log(`Blog ${blogId} disliked by user ${userId}`);

    return res.status(200).json({
      success: true,
      message: "Blog disliked successfully",
      blog,
    });
  } catch (error) {
    console.error("Error in dislikeBlog:", error);
    return res.status(500).json({
      success: false,
      message: "Error disliking blog",
      error: error.message,
    });
  }
};

export const getMyTotalBlogLikes = async (req, res) => {
  try {
    const userId = req.id; // assuming you use authentication middleware

    // Step 1: Find all blogs authored by the logged-in user
    const myBlogs = await Blog.find({ author: userId }).select("likes");

    // Step 2: Sum up the total likes
    const totalLikes = myBlogs.reduce(
      (acc, blog) => acc + (blog.likes?.length || 0),
      0
    );

    res.status(200).json({
      success: true,
      totalBlogs: myBlogs.length,
      totalLikes,
    });
  } catch (error) {
    console.error("Error getting total blog likes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total blog likes",
    });
  }
};
