import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./FollowingFeed";
import HomeTabs from "./HomeTabs";

/**
 * Home Page Component
 * 
 * The main feed page showing posts and trends.
 */
export default async function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <HomeTabs />
      </div>
      <TrendsSidebar />
    </main>
  );
}
