import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const isDev = process.env.NODE_ENV === "development";

export async function POST(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: "Upload API only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate filename
    const timestamp = Date.now();
    const webFilename = `profile-${timestamp}-web.webp`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const webPath = path.join(uploadsDir, webFilename);

    // Optimize image for web using Sharp
    await sharp(buffer)
      .resize(400, 400, {
        fit: "cover",
        position: "center"
      })
      .webp({ quality: 85 })
      .toFile(webPath);

    // Create smaller version for PDF
    const pdfFilename = `profile-${timestamp}-pdf.webp`;
    const pdfPath = path.join(uploadsDir, pdfFilename);

    await sharp(buffer)
      .resize(200, 200, {
        fit: "cover",
        position: "center"
      })
      .webp({ quality: 80 })
      .toFile(pdfPath);

    // Return relative paths
    const webUrl = `/uploads/${webFilename}`;
    const pdfUrl = `/uploads/${pdfFilename}`;

    return NextResponse.json({
      success: true,
      webUrl,
      pdfUrl,
      message: "Image uploaded and optimized successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: "Delete API only available in development mode" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const webUrl = searchParams.get("webUrl");
    const pdfUrl = searchParams.get("pdfUrl");

    if (webUrl && webUrl.startsWith("/uploads/")) {
      const webPath = path.join(process.cwd(), "public", webUrl);
      if (fs.existsSync(webPath)) {
        fs.unlinkSync(webPath);
      }
    }

    if (pdfUrl && pdfUrl.startsWith("/uploads/")) {
      const pdfPath = path.join(process.cwd(), "public", pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Images deleted successfully"
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 }
    );
  }
}
