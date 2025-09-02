import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BlogCardList = ({ blog }) => {
  const navigate = useNavigate();
  const date = new Date(blog.createdAt);
  const formattedDate = date.toLocaleDateString("en-GB");
  return (
    <div className="bg-white dark:bg-gray-900 dark:border-purple-900/50 border-purple-100 flex flex-col md:flex-row md:gap-10 p-5 rounded-xl shadow-md hover:shadow-xl border hover:scale-102 transition-all duration-300">
      <div>
        <img
          src={blog.thumbnail}
          alt=""
          className="rounded-lg md:w-[300px] object-cover h-48 hover:scale-105 transition-all"
        />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-3 md:mt-0 font-medium">
            By {blog.author.firstName} | {blog.category} | {formattedDate}
          </p>
          <h2 className="text-2xl font-semibold mt-2">{blog.title}</h2>
          <h3 className="text-gray-500 dark:text-gray-400 mt-1">
            {blog.subtitle}
          </h3>
          <p className="mt-3 text-gray-700 dark:text-gray-300">
            {blog.description &&
              blog.description.replace(/<[^>]*>/g, "").substring(0, 150)}
            ...
          </p>
        </div>
        <Button
          onClick={() => navigate(`/blogs/${blog._id}`)}
          className="mt-4 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 px-4 py-2 rounded-lg text-sm self-start"
        >
          Read More
        </Button>
      </div>
    </div>
  );
};

export default BlogCardList;
