import { IPost } from "@/types";
import { FC } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { FiHeart, FiMessageSquare } from "react-icons/fi";

interface PostCardProps {
  post: IPost;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  return (
    <div className="card-style flex justify-between">
      <div>
        <div>
          <span className="font-semibold">{post.user.name}</span> #
          {post.user.id.substring(post.user.id.length - 4)}
        </div>
        <div>{post.content}</div>
      </div>
      <div>
        <div>
          {formatDistanceToNow(new Date(post.createdAt), {
            locale: ko,
            addSuffix: true,
          })}
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <FiMessageSquare /> 0
          </div>
          <div className="flex items-center gap-1">
            <FiHeart /> 0
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
