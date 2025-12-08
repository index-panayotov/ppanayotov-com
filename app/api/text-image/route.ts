import { NextRequest, NextResponse } from "next/server";
import { userProfile } from "@/data/user-profile";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fieldType = searchParams.get("fieldType");
  const fontSize = parseInt(searchParams.get("size") || "26", 10);
  const color = searchParams.get("color") || "#222";
  const bg = searchParams.get("bg") || "transparent";

  if (!fieldType || (fieldType !== "phone" && fieldType !== "email")) {
    return new NextResponse(
      "Please specify fieldType parameter as either 'phone' or 'email'",
      { status: 400 }
    );
  }

  // Dynamic import of canvas only when needed (avoids build-time issues)
  try {
    const { createCanvas } = await import("canvas");

    // Get the specific field value from user profile
    const text = fieldType === "phone" ? userProfile.phone : userProfile.email;

    if (!text) {
      return new NextResponse(
        `No ${fieldType} found in user profile`,
        { status: 404 }
      );
    }

    // Use system fonts for reliable rendering (avoids Pango warnings)
    const fontFamily = "sans-serif";

    // Estimate width
    const canvas = createCanvas(1, 1);
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}px ${fontFamily}`;
    const textWidth = ctx.measureText(text).width;
    const padding = 12;
    const width = Math.ceil(textWidth + padding * 2);
    const height = fontSize + padding * 2;

    const outCanvas = createCanvas(width, height);
    const outCtx = outCanvas.getContext("2d");
    if (bg !== "transparent") {
      outCtx.fillStyle = bg;
      outCtx.fillRect(0, 0, width, height);
    }
    outCtx.font = `${fontSize}px ${fontFamily}`;
    outCtx.fillStyle = color;
    outCtx.textBaseline = "top";
    outCtx.fillText(text, padding, padding);

    const buffer = outCanvas.toBuffer("image/png");
    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error("Canvas library error:", error);
    return new NextResponse(
      "Text-to-image generation unavailable (canvas library not available)",
      { status: 503 }
    );
  }
}
