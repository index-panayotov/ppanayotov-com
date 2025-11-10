import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { logger } from "@/lib/logger";
import { createTypedSuccessResponse, createTypedErrorResponse, API_ERROR_CODES } from "@/lib/api-response";
import { withDevOnly } from "@/lib/api-utils";

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
 */
export const POST = withDevOnly(async (request: NextRequest) => {
  let file: File | null = null;
  try {
    const formData = await request.formData();
    file = formData.get("file") as File;

    if (!file) {
      return createTypedErrorResponse(API_ERROR_CODES.BAD_REQUEST, "No file provided");
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return createTypedErrorResponse(API_ERROR_CODES.BAD_REQUEST, "File must be an image");
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return createTypedErrorResponse(API_ERROR_CODES.PAYLOAD_TOO_LARGE, "File size must be less than 5MB");
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
      return createTypedErrorResponse(API_ERROR_CODES.BAD_REQUEST, 'Invalid image file. File does not match expected image format.');
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

    return createTypedSuccessResponse({
      webUrl,
      pdfUrl,
      message: "Image uploaded and optimized successfully"
    });
  } catch (error) {
    logger.error('Image upload failed', error as Error, {
      fileName: file?.name,
      fileSize: file?.size
    });
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, "Failed to upload image");
  }
});

export const DELETE = withDevOnly(async (request: NextRequest) => {
  let webUrl: string | null = null;
  let pdfUrl: string | null = null;
  try {
    const { searchParams } = new URL(request.url);
    webUrl = searchParams.get("webUrl");
    pdfUrl = searchParams.get("pdfUrl");

    if (webUrl && webUrl.startsWith("/uploads/")) {
      const webPath = path.join(process.cwd(), "public", webUrl.substring(1));
      if (fs.existsSync(webPath)) {
        fs.unlinkSync(webPath);
      }
    }

    if (pdfUrl && pdfUrl.startsWith("/uploads/")) {
      const pdfPath = path.join(process.cwd(), "public", pdfUrl.substring(1));
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    logger.info('Profile images deleted successfully', { webUrl, pdfUrl });

    return createTypedSuccessResponse({
      message: "Images deleted successfully"
    });
  } catch (error) {
    logger.error('Failed to delete images', error as Error, { webUrl, pdfUrl });
    return createTypedErrorResponse(API_ERROR_CODES.INTERNAL_SERVER_ERROR, "Failed to delete images");
  }
});
