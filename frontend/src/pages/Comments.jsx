import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import api from "../lib/api";
import { Edit, Eye, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Comments = () => {
  const [allComments, setAllComments] = useState([]);
  const navigate = useNavigate();
  const getTotalComments = async () => {
    try {
      const res = await api.get(`/api/v1/comment/my-blogs/comments`);
      if (res.data.success) {
        setAllComments(res.data.comments);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTotalComments();
  }, []);
  console.log(allComments);

  return (
    <div className="min-h-screen w-full pt-20 bg-gray-900">
      <div className="flex justify-center px-4">
        <div className="w-full max-w-5xl">
          <Card className="w-full p-5 space-y-2 bg-gray-800/70 border-none rounded-lg">
            <Table>
              <TableCaption>A list of your recent comments.</TableCaption>
              <TableHeader>
                <TableRow className="border-b border-gray-700">
                  {/* <TableHead className="w-[100px]">Author</TableHead> */}
                  <TableHead className="text-gray-300">Blog Title</TableHead>
                  <TableHead className="text-gray-300">Comment</TableHead>
                  <TableHead className="text-gray-300">Author</TableHead>
                  <TableHead className="text-center text-gray-300">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allComments?.map((comment, index) => (
                  <TableRow key={index} className="border-b border-gray-700">
                    {/* <TableCell className="font-medium">{item.author.firstName}</TableCell> */}
                    <TableCell className="flex gap-4 items-center text-gray-300">
                      {/* <img src={item.thumbnail} alt="" className='w-20 rounded-md hidden md:block' /> */}
                      {comment.postId.title}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {comment.content}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {comment.userId.firstName}
                    </TableCell>
                    <TableCell className="text-right flex gap-3 items-center justify-center">
                      <Eye
                        className="cursor-pointer text-gray-300 hover:text-purple-400 transition-colors"
                        onClick={() => navigate(`/blogs/${comment.postId._id}`)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* <TableFooter>
                      <TableRow>
                          <TableCell colSpan={3}>Total</TableCell>
                          <TableCell className="text-right">$2,500.00</TableCell>
                      </TableRow>
                  </TableFooter> */}
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Comments;
