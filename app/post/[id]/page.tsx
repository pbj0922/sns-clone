"use client";

import { IComment, IPost } from "@/types";
import axios from "axios";
import { NextPage } from "next";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostCard from "@/app/components/PostCard";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const PostDetail: NextPage = () => {
  const [post, setPost] = useState<IPost>();
  // comment content
  const [content, setContent] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>([]);

  const { id } = useParams();

  const { data: session } = useSession();

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
      <form className="flex flex-col" onSubmit={onSubmitCreateComment}>
        <textarea
          className="input-style h-20 resize-none pt-2 mt-4 w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!session}
          placeholder={
            session
              ? "댓글을 작성하세요."
              : "로그인 후 댓글을 작성할 수 있습니다."
          }
        />
        <input
          className={`btn-style w-fit self-end mt-1 ${
            !session && "text-gray-200 border-gray-200"
          }`}
          type="submit"
          value="댓글 생성"
          disabled={!session}
        />
      </form>
      <ul className="mt-4">
        {comments?.map((v, i) => (
          <li key={v.id} className="flex justify-between gap-2">
            <div>{v.content}</div>
            <div>
              <span className="font-semibold">{v.user.name}</span>
              <span className="ml-1">
                #{v.user.id.substring(v.user.id.length - 4)}
              </span>
              <span className="ml-2">
                {formatDistanceToNow(new Date(v.createdAt), {
                  locale: ko,
                  addSuffix: true,
                })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetail;
