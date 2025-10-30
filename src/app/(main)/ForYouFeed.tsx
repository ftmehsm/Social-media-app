"use client";

import Post from "@/components/posts/Post";
import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function ForYouFeed() {
  const query = useQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: async () => {
      const res = await fetch("/api/posts/for-you");
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      return res.json();
    },
  });

  if (query.status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.status === "error") {
    return <p className="text-center text-destructive">Error fetching posts</p>;
  }

  return (
    <>
      {query.data.map((post: PostData) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
