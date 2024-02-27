import { Comment, Post, User } from "@prisma/client";

export interface IPost extends Post {
  user: User;
}

export interface IComment extends Comment {
  user: User;
}
