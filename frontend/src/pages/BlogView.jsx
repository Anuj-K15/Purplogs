import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  // BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Heart, MessageSquare, Share2 } from "lucide-react";
import CommentBox from "@/components/CommentBox";
import axios from "axios";
import api from "@/lib/api";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { setBlog } from "@/redux/blogSlice";
import { toast } from "sonner";

const BlogView = () => {
  const params = useParams();
  const blogId = params.blogId;
  const { blog } = useSelector((store) => store.blog);
  const { user } = useSelector((store) => store.auth);
  const selectedBlog = blog.find((blog) => blog._id === blogId);
  const [blogLike, setBlogLike] = useState(selectedBlog?.likes?.length || 0);
  const { comment } = useSelector((store) => store.comment);
  const [liked, setLiked] = useState(
    (user &&
      selectedBlog?.likes?.some((id) =>
        typeof id === "string" ? id === user?._id : id?._id === user?._id
      )) ||
      false
  );
  const dispatch = useDispatch();

  console.log("Selected blog:", selectedBlog);
  console.log("User:", user);
  console.log("Initial liked state:", liked);

  const likeOrDislikeHandler = async () => {
    try {
      if (!user || !user._id) {
        toast.error("Please login to like blogs");
        return;
      }

      if (!selectedBlog || !selectedBlog._id) {
        toast.error("Blog not found");
        return;
      }

      const action = liked ? "dislike" : "like";
      console.log(
        `Sending ${action} request for blog ID:`,
        selectedBlog._id,
        "User ID:",
        user._id
      );

      const res = await api.get(`/api/v1/blog/${selectedBlog._id}/${action}`);
      console.log(`${action} response:`, res.data);

      if (res.data.success) {
        const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
        setBlogLike(updatedLikes);
        setLiked(!liked);

        // Update the blog in the redux store
        const updatedBlogData = blog.map((p) =>
          p._id === selectedBlog._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        toast.success(res.data.message);
        dispatch(setBlog(updatedBlogData));
      }
    } catch (error) {
      console.error("Error in like/dislike:", error);

      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(
          error.response.data.message || "Failed to update like status"
        );
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  const changeTimeFormat = (isoDate) => {
    const date = new Date(isoDate);
    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);
    return formattedDate;
  };

  // const handleShare = (blogId) => {
  //     const blogUrl = `${window.location.origin}/blogs/${blogId}`;
  //     navigator.clipboard.writeText(blogUrl).then(() => {
  //         toast.success('Blog link copied to clipboard!');
  //     }).catch((err) => {
  //         console.error('Failed to copy:', err);
  //     });
  // };
  const handleShare = (blogId) => {
    const blogUrl = `${window.location.origin}/blogs/${blogId}`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this blog!",
          text: "Read this amazing blog post.",
          url: blogUrl,
        })
        .then(() => console.log("Shared successfully"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      // fallback: copy to clipboard
      navigator.clipboard.writeText(blogUrl).then(() => {
        toast.success("Blog link copied to clipboard!");
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="pt-14">
      <div className="max-w-6xl mx-auto p-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={"/"}>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={"/blogs"}>Blogs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {/* Blog Header */}
        <div className="my-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {selectedBlog.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={selectedBlog.author.photoUrl} alt="Author" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {selectedBlog.author.firstName} {selectedBlog.author.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedBlog.author.occupation}
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Published on {changeTimeFormat(selectedBlog.createdAt)} • 8 min
              read
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={selectedBlog?.thumbnail}
            alt="Next.js Development"
            width={1000}
            height={500}
            className="w-full object-cover"
          />
          <p className="text-sm text-muted-foreground mt-2 italic">
            {selectedBlog.subtitle}
          </p>
        </div>

        <p
          className=""
          dangerouslySetInnerHTML={{ __html: selectedBlog.description }}
        />

        <div className="mt-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">Web Development</Badge>
            <Badge variant="secondary">JavaScript</Badge>
          </div>

          {/* Engagement */}
          <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
            <div className="flex items-center space-x-4">
              <Button
                onClick={likeOrDislikeHandler}
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                disabled={!user}
                title={
                  user
                    ? liked
                      ? "Unlike this blog"
                      : "Like this blog"
                    : "Login to like this blog"
                }
              >
                {liked ? (
                  <FaHeart
                    size={"24"}
                    className="cursor-pointer text-red-600"
                  />
                ) : (
                  <FaRegHeart
                    size={"24"}
                    className="cursor-pointer hover:text-gray-600 text-white"
                  />
                )}
                <span>{blogLike || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{comment?.length || 0} Comments</span>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => handleShare(selectedBlog._id)}
                variant="ghost"
                size="sm"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <CommentBox selectedBlog={selectedBlog} />

        {/* Author Bio */}
        {/* <Card className="mb-12">
                    <CardContent className="flex items-start space-x-4 pt-6">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Author" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold mb-1">About Jane Doe</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Jane is a lead developer with over 10 years of experience in web development. She specializes in React and
                                Next.js and has helped numerous companies build modern, performant websites.
                            </p>
                            <Button variant="outline" size="sm">
                                Follow
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}
      </div>
    </div>
  );
};

export default BlogView;
