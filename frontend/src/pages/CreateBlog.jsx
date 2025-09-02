import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setBlog } from "@/redux/blogSlice";
import axios from "axios";
import api from "../lib/api";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const { blog } = useSelector((store) => store.blog);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getSelectedCategory = (value) => {
    setCategory(value);
  };
  const createBlogHandler = async () => {
    try {
      setLoading(true);
      const res = await api.post(
        `/api/v1/blog/`,
        { title, category },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data.success) {
        dispatch(setBlog([...blog, res.data.blog]));
        navigate(`/dashboard/write-blog/${res.data.blog._id}`);
        toast.success(res.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full pt-20 bg-gray-900">
      <div className="flex justify-center px-4">
        <div className="w-full max-w-5xl">
          <Card className="p-6 md:p-10 bg-gray-800/70 border-none rounded-lg">
            <h1 className="text-3xl font-bold text-white mb-2">
              Basic Blog Information
            </h1>
            <p className="text-gray-300 mb-6">
              Make changes to your blogs here. Click publish when you're done.
            </p>
            <div className="mt-10">
              <div>
                <Label className="text-gray-300">Title</Label>
                <Input
                  type="text"
                  placeholder="Your Blog Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div className="mt-4 mb-5">
                <Label className="text-gray-300">Category</Label>
                <Select onValueChange={getSelectedCategory}>
                  <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-gray-300">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700 text-gray-300">
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      <SelectItem
                        value="Web Development"
                        className="hover:bg-purple-900/30 focus:bg-purple-900/30"
                      >
                        Web Development
                      </SelectItem>
                      <SelectItem
                        value="Digital Marketing"
                        className="hover:bg-purple-900/30 focus:bg-purple-900/30"
                      >
                        Digital Marketing
                      </SelectItem>
                      <SelectItem
                        value="Blogging"
                        className="hover:bg-purple-900/30 focus:bg-purple-900/30"
                      >
                        Blogging
                      </SelectItem>
                      <SelectItem
                        value="Photography"
                        className="hover:bg-purple-900/30 focus:bg-purple-900/30"
                      >
                        Photography
                      </SelectItem>
                      <SelectItem
                        value="Cooking"
                        className="hover:bg-purple-900/30 focus:bg-purple-900/30"
                      >
                        Cooking
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4 mt-8">
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={loading || !title || !category}
                  onClick={createBlogHandler}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
