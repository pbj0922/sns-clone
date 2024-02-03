import { Post } from "@prisma/client";

export interface IPost extends Post {
  user: User;
}
