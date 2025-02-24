"use client";

import { Loader, Space } from "@/lib/mantine/core";
import type { Post } from "@/types";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "../PostCard";
import { fetchPost } from "./action";

type PostListProps = {
  initialOffset: number;
  initialPosts: Post[];
};

const PER_PAGE = 10;

export default function FollowersPostList({
  initialOffset,
  initialPosts,
}: PostListProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [offset, setOffset] = useState<number>(initialOffset);
  const [next, setNext] = useState<boolean>(true);
  const [ref, inView] = useInView();

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (inView) {
      const loadMorePost = async () => {
        if (!next) return true;
        const { data, next: apiNext } = await fetchPost(offset, PER_PAGE);
        if (posts.length === 0) return true;
        setPosts((posts) => [...posts, ...data]);
        setOffset((offset) => offset + PER_PAGE);
        setNext(apiNext);
      };
      loadMorePost();
    }
  }, [inView]);

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {next && (
        <div className="text-center w-full" ref={ref}>
          <Space h="md" />
          <Loader />
        </div>
      )}
    </div>
  );
}
