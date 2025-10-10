import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { logger } from "@/lib/logger";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

const isDev = env.NODE_ENV === "development";

/**
 * Image file signatures (magic numbers) for validation
 * Format: { extension: [magic number bytes] }
 */
const IMAGE_SIGNATURES: Record<string, number[][]> = {
  'jpg': [[0xFF, 0xD8, 0xFF]],
  'jpeg': [[0xFF, 0xD8, 0xFF]],
  'png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'gif': [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61], [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]], // GIF87a or GIF89a
  'webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF (WebP container)
  'bmp': [[0x42, 0x4D]],
  'ico': [[0x00, 0x00, 0x01, 0x00]],
};

/**
 * Validates file is actually an image by checking magic numbers (file signature)
 * @param buffer - File buffer to validate
 * @returns True if valid image, false otherwise
 */
function isValidImageFile(buffer: Buffer): boolean {
  // Check against all known image signatures
  for (const [ext, signatures] of Object.entries(IMAGE_SIGNATURES)) {
    for (const signature of signatures) {
      // Check if buffer starts with this signature
      const matches = signature.every((byte, index) => buffer[index] === byte);
      if (matches) {
        // For WebP, also verify WEBP marker at offset 8
        if (ext === 'webp') {
          const webpMarker = [0x57, 0x45, 0x42, 0x50]; // "WEBP"
          const webpMatches = webpMarker.every((byte, index) => buffer[8 + index] === byte);
          return webpMatches;
        }
        return true;
      }
    }
  }
  return false;
}

/**
 * POST - Upload and optimize profile image
 * Rate limit: 10 requests per minute
 */
export async function POST(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: "Upload API only available in development mode" },
      { status: 403 }
    );
  }

  // Apply rate limiting (10 uploads per minute)
  const { limited, remaining, resetAt } = checkRateLimit(request, 10, 60000);

  if (limited) {
    const resetInSeconds = Math.ceil((resetAt - Date.now()) / 1000);
    logger.warn("Upload API rate limit exceeded", {
      endpoint: "/api/upload",
      remaining,
      resetInSeconds,
    });

    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later.", retryAfter: resetInSeconds },
      {
        status: 429,
        headers: {
          'Retry-After': resetInSeconds.toString(),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetAt.toString(),
        },
      }
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

    // Validate image files using magic number verification
    if (!isValidImageFile(buffer)) {
      logger.warn('Invalid image file rejected - magic number validation failed', {
        fileName: file.name,
        mimeType: file.type,
        size: file.size
      });
      return NextResponse.json(
        { error: 'Invalid image file. File does not match expected image format.' },
        { status: 400 }
      );
    }

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

    logger.info('Profile image uploaded successfully', {
      webUrl,
      pdfUrl,
      originalSize: file.size,
      originalName: file.name
    });

    return NextResponse.json({
      success: true,
      webUrl,
      pdfUrl,
      message: "Image uploaded and optimized successfully"
    });
  } catch (error) {
    logger.error('Image upload failed', error as Error, {
      fileName: file?.name,
      fileSize: file?.size
    });
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

    logger.info('Profile images deleted successfully', { webUrl, pdfUrl });

    return NextResponse.json({
      success: true,
      message: "Images deleted successfully"
    });
  } catch (error) {
    logger.error('Failed to delete images', error as Error, { webUrl, pdfUrl });
    return NextResponse.json(
      { error: "Failed to delete images" },
      { status: 500 }
    );
  }
}
