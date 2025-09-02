import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import JoditEditor from "jodit-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import api from "../lib/api";
import { toast } from "sonner";
import { setBlog } from "@/redux/blogSlice";

const UpdateBlog = () => {
  const editor = useRef(null);

  const [loading, setLoading] = useState(false);
  const [publish, setPublish] = useState(false);
  const params = useParams();
  const id = params.blogId;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog } = useSelector((store) => store.blog);
  const selectBlog = blog.find((blog) => blog._id === id) || {};
  const [content, setContent] = useState(selectBlog?.description || "");

  const [blogData, setBlogData] = useState({
    title: selectBlog?.title || "",
    subtitle: selectBlog?.subtitle || "",
    description: content,
    category: selectBlog?.category || "",
    thumbnail: null,
  });
  const [previewThumbnail, setPreviewThumbnail] = useState(
    selectBlog?.thumbnail || ""
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectCategory = (value) => {
    setBlogData({ ...blogData, category: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload only JPG, JPEG or PNG images");
        e.target.value = ""; // Reset input
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        e.target.value = ""; // Reset input
        return;
      }

      console.log("Selected thumbnail:", file.name, file.type, file.size);
      setBlogData({ ...blogData, thumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };

  const updateBlogHandler = async () => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", content);
    formData.append("category", blogData.category);

    // Only append file if a new thumbnail has been selected
    if (blogData.thumbnail && typeof blogData.thumbnail !== "string") {
      console.log("Appending file to FormData:", blogData.thumbnail);
      formData.append("file", blogData.thumbnail);
    } else {
      console.log("No new thumbnail to upload");
    }

    try {
      setLoading(true);
      console.log("Sending update request for blog ID:", id);

      const res = await api.put(`/api/v1/blog/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        console.log("Blog updated successfully:", res.data);
      }
    } catch (error) {
      console.error("Error updating blog:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const togglePublishUnpublish = async (action) => {
    console.log("action", action);

    try {
      setLoading(true);
      const res = await api.patch(`/api/v1/blog/${id}?publish=${action}`);
      console.log("Publish response:", res.data);

      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);
        navigate(`/dashboard/your-blog`);
      }
    } catch (error) {
      console.error("Publish error:", error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to update publish status"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async () => {
    try {
      const res = await api.delete(`/api/v1/blog/delete/${id}`);
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
        navigate("/dashboard/your-blog");
      }
      console.log(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error("something went error");
    }
  };

  return (
    <div className="pb-10 px-3 pt-20 md:ml-[320px]">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 space-y-2">
          <h1 className=" text-4xl font-bold ">Basic Blog Information</h1>
          <p className="">
            Make changes to your blogs here. Click publish when you're done.
          </p>
          <div className="space-x-2">
            <Button
              onClick={() =>
                togglePublishUnpublish(
                  selectBlog.isPublished ? "false" : "true"
                )
              }
            >
              {selectBlog?.isPublished ? "UnPublish" : "Publish"}
            </Button>
            <Button variant="destructive" onClick={deleteBlog}>
              Remove Course
            </Button>
          </div>
          <div className="pt-10">
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Enter a title"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              placeholder="Enter a subtitle"
              name="subtitle"
              value={blogData.subtitle}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>
          <div>
            <Label>Description</Label>
            <JoditEditor
              ref={editor}
              value={blogData.description}
              onChange={(newContent) => setContent(newContent)}
              className="jodit_toolbar"
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select
              onValueChange={selectCategory}
              defaultValue={blogData.category}
              className="dark:border-gray-300"
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="Digital Marketing">
                    Digital Marketing
                  </SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                  <SelectItem value="Photgraphy">Photgraphy</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Thumbnail</Label>
            <Input
              id="file"
              type="file"
              onChange={selectThumbnail}
              accept="image/jpeg,image/jpg,image/png"
              className="w-fit dark:border-gray-300"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Button onClick={updateBlogHandler}>
              {loading ? "Please Wait" : "Save"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
