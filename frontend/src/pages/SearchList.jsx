import BlogCard from "@/components/BlogCard";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const SearchList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q");
  const { blog } = useSelector((store) => store.blog);

  // Filter blogs only if query exists and blog array has items
  const filteredBlogs =
    blog && query
      ? blog.filter(
          (blog) =>
            (blog.title &&
              blog.title.toLowerCase().includes(query.toLowerCase())) ||
            (blog.subtitle &&
              blog.subtitle.toLowerCase().includes(query.toLowerCase())) ||
            (blog.category &&
              blog.category.toLowerCase() === query.toLowerCase())
        )
      : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="mb-5 text-2xl font-semibold">
          Search Results for: "{query || ""}"
        </h2>
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 my-10">
            {filteredBlogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No blogs found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchList;
