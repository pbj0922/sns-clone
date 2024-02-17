"use client";

import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Post } from "@prisma/client";
import Image from "next/image";

const PostCreate: NextPage = () => {
  const [content, setContent] = useState<string>("");
  const [post, setPost] = useState<Post>();
  const [image, setImage] = useState<string>("");

  const { data: session } = useSession();

  const router = useRouter();

  const onSubmitCreate = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!content || !session) return;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/post`,
        // `http://localhost:3000/api/post`,
        {
          content,
          postId: post?.id,
        }
      );

      if (response.status !== 200) return;

      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  const onUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) return;

      const formData = new FormData();

      formData.append("imageFile", e.target.files[0]);

      const postResponse = await axios.post<Post>(
        `${process.env.NEXT_PUBLIC_URL}/api/post/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPost(postResponse.data);

      const getResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/post/image?image-file-name=${postResponse.data.image}`
      );

      setImage(getResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (session) return;

    router.replace("/");
  }, [session]);

  return (
    <div>
      <form className="flex flex-col p-4" onSubmit={onSubmitCreate}>
        <textarea
          className="input-style h-96 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {image && (
          <div className="image-style">
            <Image className="object-cover" src={image} alt="preview" fill />
          </div>
        )}
        <div className="mt-2 self-end">
          <label className="btn-style py-[2px]" htmlFor="uploadImage">
            이미지
          </label>
          <input
            id="uploadImage"
            className="hidden"
            type="file"
            accept="image/*"
            onChange={onUploadImage}
          />
          <input className="btn-style ml-2" type="submit" value="글 생성" />
        </div>
      </form>
    </div>
  );
};

export default PostCreate;
