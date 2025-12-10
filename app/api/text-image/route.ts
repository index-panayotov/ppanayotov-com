import { NextRequest, NextResponse } from "next/server";
import { userProfile } from "@/data/user-profile";
import sharp from "sharp";

/**
 * XML escape function to prevent injection in SVG text
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fieldType = searchParams.get("fieldType");
  const fontSize = parseInt(searchParams.get("size") || "26", 10);
  const color = searchParams.get("color") || "#222";
  const bg = searchParams.get("bg") || "transparent";

  if (!fieldType || !["phone", "email", "location"].includes(fieldType)) {
    return new NextResponse(
      "Please specify fieldType parameter as 'phone', 'email', or 'location'",
      { status: 400 }
    );
  }

  // Validate fontSize bounds (security: prevent resource exhaustion)
  if (fontSize < 8 || fontSize > 72) {
    return new NextResponse(
      "Font size must be between 8 and 72",
      { status: 400 }
    );
  }

  // Get the specific field value from user profile
  let text: string | undefined;
  switch (fieldType) {
    case "phone":
      text = userProfile.phone;
      break;
    case "email":
      text = userProfile.email;
      break;
    case "location":
      text = userProfile.location;
      break;
  }

  if (!text) {
    return new NextResponse(
      `No ${fieldType} found in user profile`,
      { status: 404 }
    );
  }

  try {
    // Estimate dimensions (approximately 0.6 chars per fontSize unit for width)
    // Minimal padding for tight alignment with icons
    const paddingX = 2;
    const paddingY = 2;
    const charWidth = fontSize * 0.6;
    const width = Math.ceil(text.length * charWidth + paddingX * 2);
    const height = Math.ceil(fontSize * 1.2 + paddingY * 2);

    // Build SVG with text
    const bgRect = bg !== "transparent"
      ? `<rect width="${width}" height="${height}" fill="${bg}"/>`
      : "";

    // Position text with proper baseline alignment
    const textY = Math.ceil(fontSize + paddingY);

    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  ${bgRect}
  <text
    x="${paddingX}"
    y="${textY}"
    font-size="${fontSize}"
    fill="${color}"
    font-family="DejaVu Sans, Liberation Sans, FreeSans, Arial, sans-serif"
  >${escapeXml(text)}</text>
</svg>`;

    // Convert SVG to PNG using Sharp
    const buffer = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    // Use logger in production, but keep simple for this utility route
    console.error("Sharp text-to-image error:", error);
    return new NextResponse(
      "Text-to-image generation failed",
      { status: 503 }
    );
  }
}
