import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth";

const VERCEL_API_URL = "https://api.vercel.com/v13/deployments";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN; // Must be set in .env

export async function POST(request: Request) {
  try {
    const auth = await getAuthContext(request);
    if (auth instanceof NextResponse) return auth;

    // Check credits (5 for deployment)
    const hasCredits = await deductCredits(auth.userId.toString(), 5);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Insufficient daily credits. Please upgrade or wait for tomorrow." },
        { status: 402 }
      );
    }

    const { html, css, js, name } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 },
      );
    }

    if (!VERCEL_TOKEN) {
      return NextResponse.json(
        { error: "Deployment service not configured (Missing Token)" },
        { status: 503 },
      );
    }

    // Construct file tree for Vercel
    const files = [
      {
        file: "index.html",
        data: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name || "Thunder Project"}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  ${html}
  <script src="script.js"></script>
</body>
</html>`,
      },
      {
        file: "style.css",
        data: css || "/* No CSS */",
      },
      {
        file: "script.js",
        data: js || "// No JS",
      },
    ];

    // Call Vercel API
    const response = await fetch(VERCEL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: (name || "thunder-project")
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
          .slice(0, 50),
        files,
        projectSettings: {
          framework: null, // Static site
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Vercel deployment failed");
    }

    return NextResponse.json({
      url: `https://${data.url}`, // The deployment URL
      dashboardUrl: data.inspectorUrl,
    });
  } catch (error: any) {
    console.error("Deploy Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
