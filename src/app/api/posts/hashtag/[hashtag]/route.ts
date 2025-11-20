import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ hashtag: string }> },
) {
  try {
    const { hashtag } = await params;
    const cursor = req.nextUrl.searchParams.get("cursor");

    const pageSize = 10;

    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Decode the hashtag from URL (in case it has special characters)
    const decodedHashtag = decodeURIComponent(hashtag);

    // Clean the hashtag (remove # if present)
    const cleanHashtag = decodedHashtag.replace(/^#/, "");

    // Validate that the hashtag only contains valid characters (alphanumeric, underscore, hyphen)
    // This matches the pattern used in TrendsSidebar: [a-zA-Z0-9_-]+
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanHashtag)) {
      return Response.json({
        posts: [],
        nextCursor: null,
      } as PostsPage);
    }

    // For hashtags, we don't need to escape since they only contain [a-zA-Z0-9_-]
    // But we'll escape any potential special characters just to be safe
    const escapedHashtag = cleanHashtag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Use raw query to find post IDs that contain the hashtag (case-insensitive)
    // Match the pattern used in TrendsSidebar: #[a-zA-Z0-9_-]+
    // We want to match #hashtag where hashtag is exactly our tag (case-insensitive)
    // Ensure it's not part of a longer hashtag by checking it's followed by non-hashtag chars or end
    // The ~* operator in PostgreSQL makes it case-insensitive
    // Pattern: Match #hashtag followed by non-hashtag character (space, punctuation, etc.) or end of string
    const hashtagRegex = `#${escapedHashtag}([^a-zA-Z0-9_-]|$)`;

    // First, get post IDs using raw SQL for accurate regex matching
    // Use parameterized query for safety
    // For cursor pagination, we need to get the createdAt of the cursor post first
    let cursorCreatedAt: Date | null = null;
    if (cursor) {
      const cursorPost = await prisma.post.findUnique({
        where: { id: cursor },
        select: { createdAt: true },
      });
      cursorCreatedAt = cursorPost?.createdAt ?? null;
    }

    const postIdsResult =
      cursor && cursorCreatedAt
        ? await prisma.$queryRawUnsafe<{ id: string }[]>(
            `SELECT id FROM posts WHERE content ~* $1 AND ("createdAt" < $2 OR ("createdAt" = $2 AND id < $3)) ORDER BY "createdAt" DESC, id DESC LIMIT $4`,
            hashtagRegex,
            cursorCreatedAt,
            cursor,
            pageSize + 1,
          )
        : await prisma.$queryRawUnsafe<{ id: string }[]>(
            `SELECT id FROM posts WHERE content ~* $1 ORDER BY "createdAt" DESC, id DESC LIMIT $2`,
            hashtagRegex,
            pageSize + 1,
          );

    const postIds = postIdsResult.map((row) => row.id);

    if (postIds.length === 0) {
      return Response.json({
        posts: [],
        nextCursor: null,
      } as PostsPage);
    }

    // Fetch the full post data with all includes
    // Maintain the same order as the raw query
    const posts = await prisma.post.findMany({
      where: {
        id: {
          in: postIds,
        },
      },
      include: getPostDataInclude(user.id),
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    const nextCursor =
      postIds.length > pageSize ? (postIds[pageSize] ?? null) : null;

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error("Error in hashtag feed:", error);
    return Response.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
