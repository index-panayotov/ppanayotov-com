# PWA Icon Generation Instructions

## ⚠️ REQUIRED BEFORE PRODUCTION DEPLOYMENT

The PWA manifest references icon files that must be generated before deploying to production.

## Required Icons

You must create the following PNG files in this directory:

- `icon-72x72.png` - Mobile home screen icon (small)
- `icon-144x144.png` - Mobile home screen icon (medium)
- `icon-192x192.png` - PWA maskable icon (for adaptive icons)
- `icon-512x512.png` - PWA splash screen / app listing icon

## How to Generate Icons

### Option 1: Online Tool (Easiest)
1. Visit https://realfavicongenerator.net/
2. Upload your source logo/image (ideally 512x512 or larger)
3. Select "PWA" icon generation
4. Download and extract icons to this directory

### Option 2: CLI Tool (Automated)
```bash
npx pwa-asset-generator [source-image] public/icons \
  --favicon --type png \
  --icon-only \
  --padding "10%"
```

### Option 3: Manual (Image Editor)
Use Photoshop, GIMP, or any image editor:
1. Open your source logo
2. Resize to each required size (72x72, 144x144, 192x192, 512x512)
3. Export as PNG with transparency (if logo supports it)
4. Save to this directory

## Icon Design Guidelines

- **Background**: Use solid color (#0f172a slate) or transparent
- **Padding**: Leave 10-15% safe zone around logo for maskable icon
- **Format**: PNG with alpha channel
- **Purpose**: Professional CV branding - should match your personal brand

## Verification

After generating icons, test the PWA manifest:
1. Run development server: `npm run dev`
2. Visit http://localhost:3000/manifest
3. Check that all icon paths resolve correctly
4. Test PWA installation on mobile device

## Quick Checklist

- [ ] Generated all 4 required icon sizes
- [ ] Icons are PNG format
- [ ] Icons match your brand/theme color
- [ ] Tested PWA installation works
- [ ] Deleted this file after icon generation (optional)
