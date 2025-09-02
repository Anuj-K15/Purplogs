import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { setBlog } from "@/redux/blogSlice";
import BlogCard from "@/components/BlogCard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminBlogs = () => {
  const [loading, setLoading] = useState(false);
  const { blog } = useSelector((store) => store.blog);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/v1/blog/get-all-blogs");
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs));
          setFilteredBlogs(res.data.blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error(error.response?.data?.message || "Failed to fetch blogs");
        setFilteredBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    getAllBlogs();
  }, [dispatch]);

  const handleFilterChange = (status) => {
    if (status === "all") {
      setFilteredBlogs(blog);
    } else {
      const filtered = blog.filter((b) =>
        status === "published" ? b.published : !b.published
      );
      setFilteredBlogs(filtered);
    }
  };

  return (
    <div className="min-h-screen w-full pt-20 bg-gray-900">
      <div className="flex justify-center px-4">
        <div className="w-full max-w-5xl py-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-violet-500 dark:from-purple-400 dark:to-violet-300 text-transparent bg-clip-text">
              Admin Blog Management
            </h1>

            <div className="flex gap-4 mb-8">
              <Button
                onClick={() => handleFilterChange("all")}
                variant="outline"
                className="border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-gray-300"
              >
                All Blogs
              </Button>
              <Button
                onClick={() => handleFilterChange("published")}
                variant="outline"
                className="border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-gray-300"
              >
                Published
              </Button>
              <Button
                onClick={() => handleFilterChange("draft")}
                variant="outline"
                className="border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-gray-300"
              >
                Drafts
              </Button>
              <Button
                onClick={() => navigate("/dashboard/write-blog")}
                className="ml-auto bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
              >
                Create New Blog
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-800/70 border border-gray-700 p-5 rounded-xl shadow-md"
                >
                  <div className="h-48 bg-gray-700 rounded-lg animate-pulse"></div>
                  <div className="mt-3 h-4 w-2/3 bg-gray-700 rounded animate-pulse"></div>
                  <div className="mt-2 h-6 bg-gray-700 rounded animate-pulse"></div>
                  <div className="mt-1 h-4 w-1/2 bg-gray-700 rounded animate-pulse"></div>
                  <div className="mt-3 h-20 bg-gray-700 rounded animate-pulse"></div>
                  <div className="mt-4 h-9 w-24 bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog, index) => (
                <div key={index} className="relative">
                  <BlogCard blog={blog} />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        blog.published
                          ? "bg-green-900/50 text-green-300"
                          : "bg-yellow-900/50 text-yellow-300"
                      }`}
                    >
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-800/50 rounded-xl">
              <h3 className="text-xl font-medium mb-2 text-white">
                No blogs found
              </h3>
              <p className="text-gray-400 mb-6">
                There are no blogs matching your criteria.
              </p>
              <Button
                onClick={() => navigate("/dashboard/write-blog")}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
              >
                Create Your First Blog
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;
