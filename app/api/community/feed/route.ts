import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Chat from "@/models/Chat";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

/**
 * GET /api/community/feed
 * Public — no auth required.
 * Query: ?page=1&limit=12&sort=latest|likes
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(
        1,
        parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT), 10),
      ),
    );
    const sort = searchParams.get("sort") === "likes" ? "likes" : "latest";
    const skip = (page - 1) * limit;

    await connectToDatabase();

    // Build pipeline with correct sort stage to satisfy Mongoose types
    const pipeline =
      sort === "likes"
        ? [
            { $match: { isPublic: true, likesCount: { $gt: 0 } } },
            { $sort: { likesCount: -1 as const, createdAt: -1 as const } },
          ]
        : [
            { $match: { isPublic: true } },
            { $sort: { createdAt: -1 as const } },
          ];

    // Aggregate to join author name without N+1
    const [result] = await Chat.aggregate([
      ...pipeline,
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "author",
                pipeline: [{ $project: { name: 1, username: 1 } }],
              },
            },
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
            {
              $project: {
                title: 1,
                description: 1,
                generatedHTML: 1,
                generatedCSS: 1,
                generatedJS: 1,
                isPublic: 1,
                likesCount: 1,
                commentsCount: 1,
                createdAt: 1,
                "author.name": 1,
                "author.username": 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const chats = result?.data ?? [];
    const total = result?.total?.[0]?.count ?? 0;

    return NextResponse.json({
      chats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      sort,
    });
  } catch (error: any) {
    console.error("Community Feed Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
