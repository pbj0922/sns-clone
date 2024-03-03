"use client";

import { IComment, IPost } from "@/types";
import axios from "axios";
import { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostCard from "@/app/components/PostCard";
import CreateCommentForm from "@/app/components/CreateCommentForm";
import CommentCard from "@/app/components/CommentCard";

const PostDetail: NextPage = () => {
  const [post, setPost] = useState<IPost>();
  // comment content
  const [content, setContent] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>([]);

  const { id } = useParams();

  const getPost = async () => {
    try {
      const response = await axios.get<IPost>(
        `${process.env.NEXT_PUBLIC_URL}/api/post/${id}`
      );

      setPost(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getComments = async () => {
    try {
      const response = await axios.get<IComment[]>(
        `${process.env.NEXT_PUBLIC_URL}/api/comment?postId=${id}`
      );

      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitCreateComment = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!content || !post) return;

      const response = await axios.post<IComment>(
        `${process.env.NEXT_PUBLIC_URL}/api/comment`,
        { content, postId: post?.id }
      );

      setComments([response.data, ...comments]);
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPost();
    getComments();
  }, []);

  return (
    <div>
      {post && <PostCard post={post} />}
      <CreateCommentForm
        onSubmitCreateComment={onSubmitCreateComment}
        content={content}
        setContent={setContent}
      />
      <ul className="mt-4">
        {comments?.map((v, i) => (
          <CommentCard key={v.id} comment={v} />
        ))}
      </ul>
    </div>
  );
};

export default PostDetail;
