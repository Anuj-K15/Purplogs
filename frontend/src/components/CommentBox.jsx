import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { LuSend } from "react-icons/lu";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import api from "../lib/api";
import { toast } from "sonner";
import { setBlog } from "@/redux/blogSlice";
import { setComment } from "@/redux/commentSlice";
import { Edit, Trash2 } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CommentBox = ({ selectedBlog }) => {
  const { user } = useSelector((store) => store.auth);
  const { comment } = useSelector((store) => store.comment);
  const [content, setContent] = useState("");
  const { blog } = useSelector((store) => store.blog);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const dispatch = useDispatch();

  const handleReplyClick = (commentId) => {
    setActiveReplyId(activeReplyId === commentId ? null : commentId);
    setReplyText("");
  };

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setContent(inputText);
  };

  useEffect(() => {
    const getAllCommentsOfBlog = async () => {
      try {
        const res = await api.get(
          `/api/v1/comment/${selectedBlog._id}/comment/all`
        );
        const data = res.data.comments;
        dispatch(setComment(data));
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Failed to load comments");
      }
    };
    getAllCommentsOfBlog();
  }, []);

  const commentHandler = async () => {
    try {
      // Validate content before sending
      if (!content || !content.trim()) {
        toast.error("Comment cannot be empty");
        return;
      }

      const res = await api.post(
        `/api/v1/comment/${selectedBlog._id}/create`,
        { content: content.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        let updatedCommentData;

        if (comment.length >= 1) {
          updatedCommentData = [...comment, res.data.comment];
        } else {
          updatedCommentData = [res.data.comment];
        }
        dispatch(setComment(updatedCommentData));

        const updatedBlogData = blog.map((p) =>
          p._id === selectedBlog._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setBlog(updatedBlogData));
        toast.success(res.data.message);
        setContent("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add comment. Please try again.");
      }
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await api.delete(`/api/v1/comment/${commentId}/delete`);
      if (res.data.success) {
        const updatedCommentData = comment.filter(
          (item) => item._id !== commentId
        );

        dispatch(setComment(updatedCommentData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete comment. Please try again.");
      }
    }
  };

  const editCommentHandler = async (commentId) => {
    try {
      // Validate content before sending
      if (!editedContent || !editedContent.trim()) {
        toast.error("Comment cannot be empty");
        return;
      }

      const res = await api.put(
        `/api/v1/comment/${commentId}/edit`,
        { content: editedContent.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        const updatedCommentData = comment.map((item) =>
          item._id === commentId
            ? { ...item, content: editedContent.trim() }
            : item
        );
        dispatch(setComment(updatedCommentData));
        toast.success(res.data.message);
        setEditingCommentId(null);
        setEditedContent("");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to edit comment. Please try again.");
      }
    }
  };

  const likeCommentHandler = async (commentId) => {
    try {
      const res = await api.get(`/api/v1/comment/${commentId}/like`);

      if (res.data.success) {
        const updatedComment = res.data.updatedComment;

        const updatedCommentList = comment.map((item) =>
          item._id === commentId ? updatedComment : item
        );

        dispatch(setComment(updatedCommentList));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to like comment. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 items-center">
        <Avatar className="border-2 border-purple-200 dark:border-purple-800">
          <AvatarImage src={user.photoUrl} />
          <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="font-semibold">
          {user.firstName} {user.lastName}
        </h3>
      </div>
      <div className="flex gap-3">
        <Textarea
          placeholder="Leave a comment"
          className="bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
          onChange={changeEventHandler}
          value={content}
        />
        <Button
          onClick={commentHandler}
          disabled={!content || !content.trim()}
          className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LuSend />
        </Button>
      </div>

      {comment.length > 0 ? (
        <div className="mt-7 bg-purple-50 dark:bg-purple-950/20 p-5 rounded-xl border border-purple-100 dark:border-purple-900/30">
          {comment.map((item, index) => {
            return (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-start">
                    <Avatar className="border-2 border-purple-200 dark:border-purple-800">
                      <AvatarImage src={item?.userId?.photoUrl} />
                      <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {item?.userId?.firstName?.charAt(0)}
                        {item?.userId?.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mb-2 space-y-1 md:w-[400px]">
                      <h1 className="font-semibold">
                        {item?.userId?.firstName} {item?.userId?.lastName}{" "}
                        <span className="text-sm ml-2 font-light text-gray-500 dark:text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </h1>
                      {editingCommentId === item?._id ? (
                        <>
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="mb-2 bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                          />
                          <div className="flex py-1 gap-2">
                            <Button
                              size="sm"
                              onClick={() => editCommentHandler(item._id)}
                              className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingCommentId(null)}
                              className="border-purple-400 text-purple-600 dark:text-purple-400 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/50 dark:hover:text-purple-300"
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300">
                          {item?.content}
                        </p>
                      )}
                      <div className="flex gap-5 items-center mt-2">
                        <div className="flex gap-2 items-center">
                          <div
                            className="flex gap-1 items-center cursor-pointer"
                            onClick={() => likeCommentHandler(item._id)}
                          >
                            {item.likes.includes(user._id) ? (
                              <FaHeart className="text-purple-600 dark:text-purple-500" />
                            ) : (
                              <FaRegHeart className="text-gray-500 dark:text-gray-400" />
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {item.numberOfLikes}
                            </span>
                          </div>
                        </div>
                        <p
                          onClick={() => handleReplyClick(item._id)}
                          className="text-sm cursor-pointer text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                        >
                          Reply
                        </p>
                      </div>
                    </div>
                  </div>
                  {user._id === item?.userId?._id ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <BsThreeDots className="text-gray-500 hover:text-purple-600 dark:hover:text-purple-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[180px] border border-purple-100 dark:border-purple-900/30">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingCommentId(item._id);
                            setEditedContent(item.content);
                          }}
                          className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950/30"
                        >
                          <Edit className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30"
                          onClick={() => deleteComment(item._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </div>
                {activeReplyId === item?._id && (
                  <div className="flex gap-3 w-full pl-12 mt-4">
                    <Textarea
                      placeholder="Reply here ..."
                      className="bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
                      onChange={(e) => setReplyText(e.target.value)}
                      value={replyText}
                    />
                    <Button
                      onClick={() => {
                        if (!replyText || !replyText.trim()) {
                          toast.error("Reply cannot be empty");
                          return;
                        }
                        // We need to implement proper reply functionality
                        // For now, create a new comment with the reply text
                        setContent(replyText.trim());
                        setTimeout(() => {
                          commentHandler();
                          setReplyText("");
                          setActiveReplyId(null);
                        }, 0);
                      }}
                      className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800"
                    >
                      <LuSend />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default CommentBox;
