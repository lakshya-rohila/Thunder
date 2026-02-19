import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Chat from "@/models/Chat";
import { getAuthContext } from "@/lib/auth";

interface RouteContext {
  params: Promise<{ username: string }>;
}

/**
 * GET /api/profile/[username]
 * Public — returns user info + stats + paginated public components.
 * Query: ?page=1&limit=12
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { username } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      48,
      Math.max(1, parseInt(searchParams.get("limit") || "12", 10)),
    );
    const skip = (page - 1) * limit;

    if (!username || username.length > 30) {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    await connectToDatabase();

    // Find requested user by username
    const user = await User.findOne({ username: username.toLowerCase() })
      .select("name username createdAt")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if requester is the owner of this profile
    const auth = await getAuthContext(request);
    const isOwner =
      !(auth instanceof NextResponse) &&
      auth.userId.toString() === user._id.toString();

    // Initial query filters
    const queryFilter: any = { userId: user._id };
    if (!isOwner) {
      queryFilter.isPublic = true;
    }

    // Aggregation: total components + total likes received in one pass
    const [statsResult] = await Chat.aggregate([
      { $match: queryFilter },
      {
        $group: {
          _id: null,
          totalComponents: { $sum: 1 },
          totalLikes: { $sum: "$likesCount" },
        },
      },
    ]);

    const totalComponents = statsResult?.totalComponents ?? 0;
    const totalLikes = statsResult?.totalLikes ?? 0;

    // Paginated components
    const [components, total] = await Promise.all([
      Chat.find(queryFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "title description generatedHTML generatedCSS generatedJS likesCount commentsCount isPublic createdAt",
        )
        .lean(),
      Chat.countDocuments(queryFilter),
    ]);

    return NextResponse.json({
      user: {
        name: user.name,
        username: user.username,
        createdAt: user.createdAt,
      },
      stats: {
        totalComponents,
        totalLikes,
      },
      components,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error: any) {
    console.error("Profile Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
