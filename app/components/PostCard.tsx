import { IPost } from "@/types";
import { FC, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { FiHeart, FiMessageSquare } from "react-icons/fi";
import Image from "next/image";
import axios from "axios";

interface PostCardProps {
  post: IPost;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const [image, setImage] = useState<string>("");

  const getImage = async (imageFileName: string) => {
    try {
      const imageResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/post/image?image-file-name=${imageFileName}`
      );

      setImage(imageResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!post.image) return;

    getImage(post.image);
  }, [post]);

  return (
    <div className="card-style flex justify-between">
      <div>
        <div className="truncate">
          <span className="font-semibold">{post.user.name}</span> #
          {post.user.id.substring(post.user.id.length - 4)}
        </div>
        {image && (
          <div className="image-style">
            <Image className="object-cover" src={image} alt="preview" fill />
          </div>
        )}
        <div className="truncate mt-1">{post.content}</div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="self-end">
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
