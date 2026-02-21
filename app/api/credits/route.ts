import { NextResponse } from "next/server";
import { getUserCredits } from "@/lib/credits";
import { getAuthContext } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const auth = await getAuthContext(request);

    if (auth instanceof NextResponse) {
      return auth;
    }

    const credits = await getUserCredits(auth.userId.toString());

    return NextResponse.json({ credits });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
