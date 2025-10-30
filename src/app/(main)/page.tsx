import PostEditor from "@/components/posts/editor/PostEditor";
import prisma from "@/lib/prisma";
import Post from "@/components/posts/Post";
import { PostDataInclude } from "@/lib/types";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: PostDataInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
}
