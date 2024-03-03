"use client";

import { Dispatch, FC, FormEvent, SetStateAction } from "react";
import { useSession } from "next-auth/react";

interface CreateCommentFormProps {
  onSubmitCreateComment: (e: FormEvent) => Promise<void>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
}

const CreateCommentForm: FC<CreateCommentFormProps> = ({
  onSubmitCreateComment,
  content,
  setContent,
}) => {
  const { data: session } = useSession();

  return (
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
  );
};

export default CreateCommentForm;
