import { FC, FormEvent, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

import CreateCommentForm from "./CreateCommentForm";
import { IComment } from "@/types";

interface CommentCardProps {
  comment: IComment;
}

const CommentCard: FC<CommentCardProps> = ({ comment }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [nestedComments, setNestedComments] = useState<IComment[]>(
    comment.nestedComments
  );

  const onSubmitCreateComment = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!content) return;

      const response = await axios.post<IComment>(
        `${process.env.NEXT_PUBLIC_URL}/api/comment/${comment.id}`,
        { content }
      );

      setContent("");
      setIsOpen(false);
      setNestedComments([response.data, ...nestedComments]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <li
        className="flex justify-between gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>{comment.content}</div>
        <div>
          <span className="font-semibold">{comment.user.name}</span>
          <span className="ml-1">
            #{comment.user.id.substring(comment.user.id.length - 4)}
          </span>
          <span className="ml-2">
            {formatDistanceToNow(new Date(comment.createdAt), {
              locale: ko,
              addSuffix: true,
            })}
          </span>
        </div>
      </li>
      {isOpen && (
        <CreateCommentForm
          content={content}
          setContent={setContent}
          onSubmitCreateComment={onSubmitCreateComment}
        />
      )}
      {nestedComments?.map((v) => (
        <div className="ml-2">
          <CommentCard key={v.id} comment={v} />
        </div>
      ))}
    </>
  );
};

export default CommentCard;
