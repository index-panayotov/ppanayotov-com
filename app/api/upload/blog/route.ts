import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const isDev = process.env.NODE_ENV === 'development';

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
 * POST - Upload blog image/file
 * Supports images and small files up to 5MB
 * Validates image files using magic number verification
 */
export async function POST(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: 'Upload API only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string; // Blog post slug for organizing uploads

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'Blog post slug is required' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate image files using magic number verification
    if (file.type.startsWith('image/')) {
      if (!isValidImageFile(buffer)) {
        return NextResponse.json(
          { error: 'Invalid image file. File does not match expected image format.' },
          { status: 400 }
        );
      }
    }

    // Create uploads directory for this blog post
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'blog', slug);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase();

    // If it's an image, optimize it
    if (file.type.startsWith('image/')) {
      const filename = `${baseName}-${timestamp}.webp`;
      const filePath = path.join(uploadsDir, filename);

      // Optimize image with Sharp
      await sharp(buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(filePath);

      const url = `/uploads/blog/${slug}/${filename}`;

      return NextResponse.json({
        success: true,
        url,
        filename,
        message: 'Image uploaded and optimized successfully'
      });
    } else {
      // For non-image files, save directly
      const filename = `${baseName}-${timestamp}.${ext}`;
      const filePath = path.join(uploadsDir, filename);

      fs.writeFileSync(filePath, buffer);

      const url = `/uploads/blog/${slug}/${filename}`;

      return NextResponse.json({
        success: true,
        url,
        filename,
        message: 'File uploaded successfully'
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Delete blog file
 */
export async function DELETE(request: NextRequest) {
  if (!isDev) {
    return NextResponse.json(
      { error: 'Delete API only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url || !url.startsWith('/uploads/blog/')) {
      return NextResponse.json(
        { error: 'Invalid file URL' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'public', url);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
