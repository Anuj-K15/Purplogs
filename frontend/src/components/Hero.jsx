import React from "react";
import heroImg from "../assets/blog2.png";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="px-4 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center h-[600px] my-10 md:my-0">
        {/* text section */}
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-violet-500 dark:from-purple-400 dark:to-violet-300 text-transparent bg-clip-text">
            Explore the Latest Tech & Web Trends
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
            Stay ahead with in-depth articles, tutorials, and insights on web
            development, digital marketing, and tech innovations.
          </p>
          <div className="flex space-x-4">
            <Link to={"/dashboard/write-blog"}>
              <Button className="text-lg bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800">
                Get Started
              </Button>
            </Link>
            <Link to={"/about"}>
              <Button
                variant="outline"
                className="border-purple-400 hover:border-purple-500 dark:border-purple-600 dark:hover:border-purple-500 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 px-6 py-3 text-lg"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        {/* image section */}
        <div className="flex items-center justify-center mt-10 md:mt-0">
          <img
            src={heroImg}
            alt="Blog Hero"
            className="md:h-[550px] md:w-[550px] rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100 dark:border-purple-900/30"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
