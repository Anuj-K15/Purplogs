import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BlogCard from "./BlogCard";
import BlogCardList from "./BlogCardList";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { setBlog } from "@/redux/blogSlice";
import api from "../lib/api";

const tags = [
  {
    category: "Blogging",
  },
  {
    category: "Web Development",
  },
  {
    category: "Digital Marketing",
  },
  {
    category: "Cooking",
  },
  {
    category: "Photography",
  },
  {
    category: "Sports",
  },
];

const RecentBlog = () => {
  const { blog } = useSelector((store) => store.blog);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllPublsihedBlogs = async () => {
      try {
        const res = await api.get(`/api/v1/blog/get-published-blogs`);
        if (res.data.success) {
          dispatch(setBlog(res.data.blogs));
        }
      } catch (error) {
        console.log(error);
        // Initialize with empty array if API fails
        if (!blog || blog.length === 0) {
          dispatch(setBlog([]));
        }
      }
    };
    getAllPublsihedBlogs();
  }, []);

  return (
    <div className="bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/30 py-16">
      <div className="max-w-6xl mx-auto flex flex-col space-y-4 items-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 dark:from-purple-400 dark:to-violet-300 text-transparent bg-clip-text">
          Recent Blogs
        </h1>
        <hr className="w-24 text-center border-2 border-purple-500 rounded-full" />
      </div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 md:px-8 lg:px-4">
        <div className="flex-1">
          <div className="mt-10 space-y-6">
            {blog && blog.length > 0 ? (
              blog
                .slice(0, 4)
                .map((blog, index) => <BlogCardList key={index} blog={blog} />)
            ) : (
              <div className="bg-white dark:bg-gray-900 dark:border-purple-900/50 border-purple-100 p-5 rounded-xl shadow-md border">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="mt-3 h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="mt-2 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="mt-1 h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="mt-3 h-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="mt-4 h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-900/50 w-full lg:w-[350px] p-6 rounded-xl shadow-md mt-10 lg:mt-10 h-fit sticky top-24">
          <h1 className="text-2xl font-semibold">Popular categories</h1>
          <div className="my-5 flex flex-wrap gap-3">
            {tags.map((item, index) => {
              return (
                <Badge
                  onClick={() => navigate(`/search?q=${item.category}`)}
                  key={index}
                  className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-800/50"
                >
                  {item.category}
                </Badge>
              );
            })}
          </div>
          <h1 className="text-xl font-semibold mt-6">
            Subscribe to Newsletter
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Get the latest posts and updates delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-10 w-full rounded-md border border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            />
            <Button className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800">
              Subscribe
            </Button>
          </div>
          <div className="mt-7">
            <h2 className="text-xl font-semibold mb-3">Suggested Blogs</h2>
            <ul className="space-y-3">
              {[
                "10 Tips to Master React",
                "Understanding Tailwind CSS",
                "Improve SEO in 2024",
              ].map((title, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:underline cursor-pointer"
                >
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentBlog;
