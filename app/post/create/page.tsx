"use client";

import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const PostCreate: NextPage = () => {
  const [content, setContent] = useState<string>("");

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
        }
      );

      if (response.status !== 200) return;

      router.replace("/");
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
        <input
          className="btn-style w-fit mt-2 self-end"
          type="submit"
          value="글 생성"
        />
      </form>
    </div>
  );
};

export default PostCreate;
