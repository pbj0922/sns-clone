"use client";

import axios from "axios";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { IPost } from "@/types";
import PostCard from "./components/PostCard";

const Home: NextPage = () => {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<IPost[]>([]);

  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const getPosts = async () => {
    try {
      const response = await axios.get<IPost[]>(
        `${process.env.NEXT_PUBLIC_URL}/api/post?page=${page}`
      );

      if (response.data.length === 0) return;

      setPage(page + 1);
      setPosts([...posts, ...response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        getPosts();
      }
    });

    if (!infiniteScrollRef.current) return;

    observer.current.observe(infiniteScrollRef.current);

    return () => observer.current?.disconnect();
  }, [page]);

  return (
    <div className="bg-red-300 grow">
      <div className="flex flex-col p-4 gap-4">
        {posts.map((v, i) => (
          <PostCard key={i} post={v} />
        ))}
      </div>
      <div className="w-full text-white" ref={infiniteScrollRef}>
        infinite scroll
      </div>
    </div>
  );
};

export default Home;
