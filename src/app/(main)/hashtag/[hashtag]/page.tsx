import HashtagFeed from "./HashtagFeed";
import TrendsSidebar from "@/components/TrendsSidebar";

interface HashtagPageProps {
  params: Promise<{ hashtag: string }>;
}

export default async function HashtagPage({ params }: HashtagPageProps) {
  const { hashtag } = await params;
  const decodedHashtag = decodeURIComponent(hashtag);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-2xl font-bold">#{decodedHashtag}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Posts with this hashtag
          </p>
        </div>
        <HashtagFeed hashtag={decodedHashtag} />
      </div>
      <TrendsSidebar />
    </main>
  );
}
