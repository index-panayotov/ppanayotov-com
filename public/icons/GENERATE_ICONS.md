# PWA Icon Generation Instructions

## 🚨 CRITICAL: REQUIRED BEFORE PRODUCTION DEPLOYMENT

The PWA manifest references icon files that **MUST** be generated before deploying to production. Without these icons, the PWA will not install on mobile devices.

## Required Icons

You must create the following PNG files in this directory:

- `icon-72x72.png` - Mobile home screen icon (small)
- `icon-144x144.png` - Mobile home screen icon (medium)
- `icon-192x192.png` - PWA maskable icon (for adaptive icons)
- `icon-512x512.png` - PWA splash screen / app listing icon

## 🚀 Quick Generation (Recommended)

### Step 1: Use Your Profile Image
Your profile image is already available at `public/uploads/profile-*-web.webp`

### Step 2: Online Tool (Easiest - 2 minutes)
1. Visit: https://realfavicongenerator.net/
2. Upload your profile image (`public/uploads/profile-*-web.webp`)
3. Select "PWA" icon generation
4. Download the generated icons
5. Extract the 4 PNG files to this `public/icons/` directory

### Step 3: Verify
```bash
# Check files exist
ls -la public/icons/
# Should show: icon-72x72.png, icon-144x144.png, icon-192x192.png, icon-512x512.png

# Test PWA manifest
npm run dev
# Visit: http://localhost:3000/manifest
# Should show valid icon paths
```

## Alternative Methods

### CLI Tool (If online tool fails)
```bash
# Install globally (one time)
npm install -g pwa-asset-generator

# Generate icons from your profile image
pwa-asset-generator public/uploads/profile-*-web.webp public/icons \
  --favicon --type png \
  --icon-only \
  --padding "10%"
```

### Manual Creation (Image Editor)
Use any image editor (Photoshop, GIMP, Canva, etc.):
1. Open your profile image
2. Resize canvas to each required size
3. Add 10% padding around your image
4. Export as PNG with transparency
5. Save to this directory

## Icon Design Guidelines

- **Source**: Use your profile photo or a simple "CV" logo
- **Background**: Solid slate color (#0f172a) or transparent
- **Padding**: 10-15% safe zone around content for maskable icons
- **Format**: PNG with alpha channel support
- **Style**: Professional, matches your CV branding

## ✅ Verification Checklist

After generating icons:

- [ ] All 4 PNG files exist in `public/icons/`
- [ ] Files are valid PNG format (not corrupted)
- [ ] Icons display correctly in browser
- [ ] PWA manifest loads without 404 errors
- [ ] Test PWA installation on mobile device
- [ ] Icons appear in mobile home screen after installation

## 🐛 Troubleshooting

**Icons not showing?**
- Clear browser cache and service worker
- Check file permissions: `chmod 644 public/icons/*.png`
- Verify manifest.json loads correctly

**PWA not installing?**
- Ensure HTTPS in production (required for PWA)
- Check all icon files exist and are accessible
- Test on actual mobile device (not just browser dev tools)

## 📝 Next Steps

Once icons are generated:
1. Commit the icon files to git
2. Test PWA installation on mobile
3. Deploy to production
4. Delete this instruction file (optional)
