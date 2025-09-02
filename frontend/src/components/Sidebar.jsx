import {
  ChartColumnBig,
  FolderPlus,
  MessageSquare,
  PencilLine,
  PlusCircle,
  SquareUser,
} from "lucide-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/logo.svg";

const Sidebar = () => {
  return (
    <div className="hidden fixed md:block bg-gray-900 w-[300px] p-4 space-y-2 h-screen z-10">
      <Link to="/" className="flex items-center gap-2 mb-8 px-2">
        <img src={Logo} alt="Logo" className="w-8 h-8 " />
        <h1 className="text-2xl font-bold text-purple-400">Purplogs</h1>
      </Link>
      <div className="text-center pt-4 px-3 space-y-3">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `text-lg ${
              isActive
                ? "bg-purple-900/50 text-purple-300 font-semibold"
                : "bg-transparent hover:bg-purple-950/30"
            } 
              flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors duration-200`
          }
        >
          <ChartColumnBig className="text-purple-400" size={20} />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `text-lg ${
              isActive
                ? "bg-purple-900/50 text-purple-300 font-semibold"
                : "bg-transparent hover:bg-purple-950/30"
            } 
              flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors duration-200`
          }
        >
          <SquareUser className="text-purple-400" size={20} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/dashboard/your-blog"
          className={({ isActive }) =>
            `text-lg ${
              isActive
                ? "bg-purple-900/50 text-purple-300 font-semibold"
                : "bg-transparent hover:bg-purple-950/30"
            } 
              flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors duration-200`
          }
        >
          <PencilLine className="text-purple-400" size={20} />
          <span>Your Blogs</span>
        </NavLink>

        <NavLink
          to="/dashboard/comments"
          className={({ isActive }) =>
            `text-lg ${
              isActive
                ? "bg-purple-900/50 text-purple-300 font-semibold"
                : "bg-transparent hover:bg-purple-950/30"
            } 
              flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors duration-200`
          }
        >
          <MessageSquare className="text-purple-400" size={20} />
          <span>Comments</span>
        </NavLink>

        <NavLink
          to="/dashboard/write-blog"
          className={({ isActive }) =>
            `text-lg ${
              isActive
                ? "bg-purple-900/50 text-purple-300 font-semibold"
                : "bg-transparent hover:bg-purple-950/30"
            } 
              flex items-center gap-3 cursor-pointer p-3 rounded-xl transition-colors duration-200`
          }
        >
          <PlusCircle className="text-purple-400" size={20} />
          <span>Create Blog</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
