import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../lib/api";
import { Card } from "@/components/ui/card";
import { PencilLine, BookOpen, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    totalComments: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  // Only show the dashboard home stats when on the main dashboard route
  const showDashboardHome = location.pathname === "/dashboard";

  useEffect(() => {
    if (showDashboardHome) {
      const fetchStats = async () => {
        try {
          setLoading(true);
          // These could be separate API calls combined
          const blogRes = await api.get("/api/v1/blog/get-own-blogs");
          const likesRes = await api.get("/api/v1/blog/my-blogs/likes");

          if (blogRes.data.success) {
            const blogs = blogRes.data.blogs || [];
            const publishedCount = blogs.filter(
              (blog) => blog.published
            ).length;

            let commentCount = 0;
            blogs.forEach((blog) => {
              commentCount += blog.comments?.length || 0;
            });

            setStats({
              totalBlogs: blogs.length,
              publishedBlogs: publishedCount,
              totalComments: commentCount,
              totalLikes: likesRes.data.totalLikes || 0,
            });
          }
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [showDashboardHome]);

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-[300px] w-full">
        {showDashboardHome ? (
          <div className="pt-24 px-4 flex justify-center">
            <div className="w-full max-w-6xl">
              <h1 className="text-3xl font-bold mb-2 text-white">
                Welcome {user?.firstName || "User"}!
              </h1>
              <p className="text-gray-300 mb-8">
                Manage your blogs, comments, and profile from your personalized
                dashboard.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <StatsCard
                  title="Total Blogs"
                  value={stats.totalBlogs}
                  icon={
                    <PencilLine
                      size={24}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  }
                  loading={loading}
                  linkTo="/dashboard/your-blog"
                />
                <StatsCard
                  title="Published"
                  value={stats.publishedBlogs}
                  icon={
                    <BookOpen
                      size={24}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  }
                  loading={loading}
                  linkTo="/dashboard/your-blog"
                />
                <StatsCard
                  title="Comments"
                  value={stats.totalComments}
                  icon={
                    <MessageSquare
                      size={24}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  }
                  loading={loading}
                  linkTo="/dashboard/comments"
                />
                <StatsCard
                  title="Total Likes"
                  value={stats.totalLikes}
                  icon={
                    <Heart
                      size={24}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  }
                  loading={loading}
                  linkTo="/dashboard/your-blog"
                />
              </div>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/dashboard/write-blog">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Create New Blog
                  </Button>
                </Link>
                <Link to="/dashboard/your-blog">
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-500 hover:bg-purple-600 hover:text-white"
                  >
                    Manage Your Blogs
                  </Button>
                </Link>
                <Link to="/dashboard/profile">
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-500 hover:bg-purple-600 hover:text-white"
                  >
                    Update Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, loading, linkTo }) => {
  return (
    <Link to={linkTo}>
      <Card className="p-6 hover:shadow-md transition-shadow bg-gray-950 border-none rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-300">{title}</h3>
          {icon}
        </div>
        {loading ? (
          <div className="h-12 bg-gray-800 rounded animate-pulse"></div>
        ) : (
          <p className="text-4xl font-bold text-purple-400">{value}</p>
        )}
      </Card>
    </Link>
  );
};

export default Dashboard;
