import axios from "axios";
import api from "../lib/api";
import React, { useEffect, useState } from "react";
import userLogo from "../assets/user.jpg";

const PopularAuthors = () => {
  const [popularUser, setPopularUser] = useState([]);

  const getAllUsers = async () => {
    try {
      const res = await api.get(`/api/v1/user/all-users`);
      if (res.data.success) {
        setPopularUser(res.data.users);
      }
    } catch (error) {
      console.log(error);
      // Set default empty array if API fails
      setPopularUser([]);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-4">
        <div className="flex flex-col space-y-4 items-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 dark:from-purple-400 dark:to-violet-300 text-transparent bg-clip-text">
            Popular Authors
          </h1>
          <hr className="w-24 text-center border-2 border-purple-500 rounded-full mb-8" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-10">
          {popularUser && popularUser.length > 0
            ? popularUser.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 items-center bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-purple-100 dark:border-purple-900/50"
                >
                  <img
                    src={user.photoUrl || userLogo}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="rounded-full h-24 w-24 md:w-32 md:h-32 border-4 border-purple-200 dark:border-purple-700 object-cover"
                  />
                  <div className="text-center">
                    <p className="font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </p>
                    {/* <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                      {user.blogCount || "0"} blogs published
                    </p> */}
                  </div>
                </div>
              ))
            : [1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 items-center bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl shadow-md border border-purple-100 dark:border-purple-900/50"
                >
                  <div className="rounded-full h-24 w-24 md:w-32 md:h-32 border-4 border-purple-200 dark:border-purple-700 bg-gray-200 dark:bg-gray-700"></div>
                  <div className="text-center">
                    <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default PopularAuthors;
