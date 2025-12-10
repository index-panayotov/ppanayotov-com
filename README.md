# PPanayotov.com

**PPanayotov.com** is an open-source, minimalist personal website and CV builder. It allows individuals to create a clean, professional online presence without the complexity of databases or heavy infrastructure. Ideal for developers, freelancers, and anyone looking to maintain a simple digital profile.

---

## ✨ Features

### 🎨 Multi-Template CV System
Choose from 3 professionally designed templates to match your industry:
- **Classic**: Animated design with typing effects, perfect for tech and creative roles
- **Professional**: ATS-optimized, clean layout for traditional industries
- **Modern**: Bold, trendy design with glassmorphism for creative portfolios

Switch templates instantly via admin settings - no code changes needed.

### 🗄️ Database-less Architecture
No database required. All content managed through TypeScript/JSON files:
- CV data, skills, and profile stored in `/data/` directory
- Version control tracks all content changes
- Easy backup and migration

### 🔐 Secure Admin Panel
Password-protected admin interface with modular pages:
- Profile data management
- Work experiences CRUD
- Skills management with AI extraction
- Blog post editor
- System settings and template selection

### 🤖 AI-Assisted Content
Powered by OpenRouter API integration:
- Polish and improve CV descriptions
- Generate professional summaries
- Extract skills from job descriptions
- Context-aware content suggestions

### 📝 Full-Featured Blog System
Complete blogging platform with:
- Toast UI WYSIWYG editor
- Markdown storage for portability
- Pagination (10 posts/page)
- RSS feed support
- SEO optimization (Open Graph, JSON-LD)

### 🛡️ Bot-Protected Contact Info
Contact information rendered as images to prevent scraping:
- Email, phone, and location protected
- Sharp + SVG text-to-image generation
- DejaVu Sans fonts for serverless compatibility
- Non-clickable display prevents bot harvesting

### 🖼️ Image Upload & Optimization
Secure image handling with:
- Drag-and-drop upload interface
- Automatic WebP conversion (400x400, 85% quality)
- Magic number validation prevents file spoofing
- Blog-specific uploads organized by post

### ⚡ Performance Optimized
Lighthouse-ready optimizations:
- **Lightweight Icons**: lucide-react for optimal tree-shaking
- **Critical CSS Inlining**: Above-the-fold CSS inlined via critters
- **ISR Caching**: Incremental Static Regeneration (40-50% faster TTFB)
- **Modern Browser Targeting**: Skips polyfills for modern browsers
- **Optimized Fonts**: next/font with local hosting

### 🏗️ Production-Ready Infrastructure
Enterprise-grade features:
- **Structured Logging**: Multi-level logging with metadata
- **Type-Safe Config**: Zod validation for fail-fast startup
- **Security Headers**: XSS protection, CSP, HSTS
- **PWA Support**: Configurable Progressive Web App

> ⚠️ **Security Note:**  
> It is strongly recommended not to upload the `admin/` folder to your production server unless properly secured. You can run the admin interface locally or restrict access during deployment.

---

## 🚧 To-Do

Planned features under development:

- [x] Add image upload support with optimization for web display
- [x] Add AI assistance to improve and polish CV text
- [x] Add settings file
- [x] Add schema.org for the home page
- [x] Introduce multiple visual templates for CV presentation (3 templates available!)
- [x] Template selector UI in admin panel
- [x] Template preview functionality
- [ ] Expand contact and social media link options
- [ ] Add support for multiple languages/localization

Have an idea? [Open an issue](https://github.com/index-panayotov/ppanayotov-com/issues) or contribute directly!

---

## 🧱 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) – React-based frontend framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- **UI Components**: [Radix UI](https://www.radix-ui.com/) – Headless, accessible UI primitives
- **AI Integration**: [OpenRouter](https://openrouter.ai/) – API for accessing various AI models
- **Image Processing**: [Sharp](https://sharp.pixelplumbing.com/) – High-performance image processing
- **Hosting**: [Vercel](https://vercel.com/) – Serverless deployment platform
- **Authentication**: Environment variable-based password protection for admin panel

---

## 🚀 Getting Started

To run the project locally:

1. **Clone the repository**

```bash
git clone [https://github.com/your-username/ppanayotov-com.git](https://github.com/index-panayotov/ppanayotov-com.git)
cd ppanayotov-com
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file at the root of your project:

```env
ADMIN_PASSWORD=your-secure-password
OPENROUTER_KEY=your-openrouter-api-key
OPENROUTER_MODEL=openai/gpt-4.1-nano
```

4. **Run the development server**

```bash
npm run dev
```

Make all changes.
Visit `http://localhost:3000` to view your site.

5. **Build and deploy**

```bash
npm run build
npm run start   # Optional: run in production mode locally
```

## 📁 Folder Structure

```
/app              → Main application (Next.js App Router)
  /api            → Backend API routes
    /admin        → Admin CRUD operations (login, blog, autoskills)
    /ai           → OpenRouter AI integration
    /upload       → Image upload endpoints
    /text-image   → Bot-protected contact image generation
  /admin          → Admin panel pages (dashboard, profile-data, experiences, settings, blog)
  /blog           → Blog pages (listing, individual posts)
  /templates      → CV template components (classic, professional, modern)
/components       → Reusable UI and admin components
  /admin          → Admin-specific components (AI-enhanced inputs, editors)
  /blog           → Blog-specific components (markdown renderer, header)
  /ui             → Reusable UI components based on Radix UI
  /performance    → Performance-optimized components (virtualized lists)
/data             → Static data files (the "database")
  /blog           → Blog content files (markdown format)
/hooks            → Custom React hooks (touch gestures, admin data)
/lib              → Utility functions and helpers
  /security       → Security utilities (slug validation)
/public           → Static assets
  /fonts          → DejaVu Sans fonts for text-image API
  /uploads        → User-uploaded images with optimized versions
    /blog         → Blog-specific uploads organized by post slug
/services         → API service integrations (OpenRouter)
/types            → TypeScript type definitions and Zod schemas
.env              → Environment variables (admin password, API keys)
```

---

## 📦 Deployment

### Deploying to Vercel (Recommended)

**Prerequisites:**
1. **Test Locally**: Run `npm run build && npm run start` to ensure production build works
2. **(Optional) Commit Profile Images**: If using custom profile images, commit them to git or use external hosting

**Deployment Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production-ready release v2.0.0"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/import](https://vercel.com/import)
   - Select your GitHub repository
   - Configure project settings (accept defaults)

3. **Set Environment Variables** (Vercel Dashboard → Settings → Environment Variables)
   ```env
   ADMIN_PASSWORD=your-secure-production-password
   OPENROUTER_KEY=your-openrouter-api-key
   OPENROUTER_MODEL=openai/gpt-4.1-nano
   # Optional: Enable admin in production (NOT RECOMMENDED)
   # NEXT_PUBLIC_ENABLE_ADMIN=true
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Visit your live site!

### Admin Panel in Production

**⚠️ Security Notice**: By default, the admin panel is **DISABLED in production** for security.

**Options:**
- **Recommended**: Use admin panel only in development mode locally
- **Advanced**: Enable in production by setting `NEXT_PUBLIC_ENABLE_ADMIN=true` environment variable in Vercel
  - Only do this if you understand the security implications
  - Ensure `ADMIN_PASSWORD` is very strong
  - Consider IP whitelisting or additional authentication

### Post-Deployment Checklist

- [ ] Environment variables set in Vercel (`ADMIN_PASSWORD`, `OPENROUTER_KEY`, `OPENROUTER_MODEL`)
- [ ] Production build tested locally (`npm run build && npm run start`)
- [ ] Live site loads correctly on desktop and mobile
- [ ] Contact information renders correctly (text-image API working)
- [ ] Blog pages load if `blogEnable: true`
- [ ] Navigation links work from all pages (/#section format)
- [ ] PWA installation works (test on mobile - requires icons in system_settings.ts)
- [ ] Admin panel blocked (or secured if enabled)
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)
- [ ] No render-blocking resources (critical CSS inlined)
- [ ] Cache headers working (`/_next/static/*` immutable, API routes cached)

### Deployment Troubleshooting

**Issue**: "PWA won't install"
- **Fix**: Ensure icons array is properly configured in `data/system_settings.ts` with valid icon paths

**Issue**: "Admin panel shows in production"
- **Fix**: Remove `NEXT_PUBLIC_ENABLE_ADMIN` environment variable

**Issue**: "Images missing after deploy"
- **Fix**: Commit images to git or use external image hosting (Cloudinary, etc.)

**Issue**: "Build fails with TypeScript errors"
- **Fix**: This is expected - build config ignores TS errors. Check for actual runtime issues.

### Alternative Deployment Platforms

While Vercel is recommended, you can also deploy to:
- **Netlify**: Similar process, configure environment variables
- **Railway**: Full-stack hosting with database options
- **Docker**: Use `output: 'standalone'` in `next.config.mjs`

---

## 🔗 Live Example

You can see the latest live version at:  
🌐 [https://www.ppanayotov.com](https://www.ppanayotov.com)

---

## 🤝 Contributing

Contributions are welcome! Here’s how you can help:

- Submit feature requests or bug reports
- Improve styling or layout
- Refactor code or optimize performance
- Help write documentation

Please fork the repository and open a pull request with your improvements. Don’t forget to update the `README.md` if needed.

---

## 📄 License

This project is open-source and available under the [MIT License](./LICENSE).

---

## 🙌 Acknowledgements

Thanks to all contributors and open-source libraries that make this project possible.

---

## 📷 Image Upload Feature

The project includes a comprehensive image upload feature with optimization for web display:

- **Web-optimized Images**: 400x400px, WebP format, 85% quality for fast web loading
- **Drag & Drop Support**: Easy uploading via drag and drop or file browser
- **External URL Support**: Option to use images hosted elsewhere
- **Validation**: File type and size validation to prevent issues

> **Note**: Print/PDF functionality has been permanently removed. The CV is designed for web presentation only.

## 🧠 AI Enhancement Features

The admin interface includes AI-powered content enhancement:

- **Smart Text Improvement**: AI assistance for polishing job descriptions, summaries, and other text
- **Context-Aware Suggestions**: AI understands the context of different CV sections
- **Professional Tone**: Ensures content maintains a professional, impactful style
- **One-Click Enhancement**: Simple button to request AI improvements

These features help create more professional, polished content with minimal effort.

## 🖼️ Image Uploads & Version Control

Uploaded images (such as profile pictures) are stored in the `/public/uploads` directory. This folder is included in `.gitignore` by default to avoid accidentally committing large or sensitive files. A `gitkeep` file is present to ensure the folder exists in the repository structure.

**If you want to commit uploaded images (e.g., profile-\*.webp) to your repository:**

- You must explicitly add them with the `-f` (force) flag, since `/public/uploads` is git-ignored:

```bash
git add .\public\uploads\profile-* -f
```

- This will add all matching uploaded images, not just the modified files.
- Remember to commit and push after adding.

> **Note:** If you do not force-add, new or updated images in `/public/uploads` will not be tracked by git and will not appear on your deployed site.

## 📚 Environment Variables

The following environment variables should be set in your `.env` file:

```env
# Admin authentication (Required - minimum 8 characters)
ADMIN_PASSWORD=your-secure-password

# OpenRouter API for AI features (Required)
OPENROUTER_KEY=sk-or-v1-your-api-key-here
OPENROUTER_MODEL=openai/gpt-4.1-nano

# Environment (Optional)
NODE_ENV=development
```

**Environment Validation:**
All environment variables are validated at startup using Zod. If any required variable is missing or invalid, the application will fail to start with clear error messages indicating what needs to be fixed.

## 🛡️ Security & Production Features

### Structured Logging
Production-ready logging system with four levels:
- `debug` - Development only, detailed diagnostic information
- `info` - General informational messages with metadata
- `warn` - Warning messages for potential issues
- `error` - Error messages with stack traces and context

All logs include structured metadata for easy filtering and debugging in production.

### Image Upload Security
Profile and blog image uploads validate files using **magic number verification** (file signatures) rather than trusting MIME types. This prevents attackers from uploading executable files disguised as images.

Supported formats: JPEG, PNG, GIF, WebP, BMP, ICO

### Type-Safe Configuration
Environment variables are validated using Zod schemas at startup:
- Enforces minimum password length (8 characters)
- Validates API key format (`sk-or-` prefix for OpenRouter)
- Provides TypeScript autocomplete for `env.*` usage
- Fails fast with detailed error messages if configuration is invalid

## 🎨 Template System

The application includes 3 professionally designed CV templates that you can switch between:

### Classic Template
**Best for**: Tech industry, creative roles, modern companies
- Animated typing effect in hero section
- Gradient backgrounds with professional color scheme
- Smooth scroll animations (fadeInUp, slideInLeft)
- Modern, engaging presentation

### Professional Template
**Best for**: All industries, corporate roles, traditional companies, job applications
- ATS-scanner friendly layout
- Print-optimized design
- Clear typography hierarchy
- Universal compatibility
- Clean, minimal aesthetic

### Modern Template
**Best for**: Design roles, startups, creative industries, portfolio showcase
- Glassmorphism effects
- CSS Grid masonry layout
- Dark mode support
- Interactive hover states
- Bold, trendy design

### Switching Templates
Edit `data/system_settings.ts` and change the `selectedTemplate` field:
```typescript
const systemSettings = {
  // ...
  selectedTemplate: "classic", // Options: "classic", "professional", "modern"
  // ...
};
```

Changes take effect immediately - no build required!

## 🛡️ Bot Protection for Contact Information

The CV templates protect sensitive contact information (email, phone, location) from bot scraping by rendering them as images:

### How It Works
- **Text-to-Image API**: Contact information is dynamically rendered as PNG images via `/api/text-image`
- **Sharp + SVG**: Uses Sharp library with SVG text rendering (no native canvas dependencies)
- **Production-Ready Fonts**: Uses DejaVu Sans font stack for reliable rendering on serverless platforms like Vercel
- **Non-Clickable**: Email and phone are visible but cannot be clicked, copied as text, or scraped by bots

### Supported Fields
- `email` - Email address
- `phone` - Phone number
- `location` - Geographic location

### Usage in Templates
```jsx
<img
  src={`/api/text-image?fieldType=email&size=16&color=%23059669&bg=transparent`}
  alt="Email address (protected from bots)"
  draggable={false}
/>
```

### API Parameters
| Parameter | Description | Default |
|-----------|-------------|---------|
| `fieldType` | Field to render: `email`, `phone`, or `location` | Required |
| `size` | Font size in pixels | `26` |
| `color` | Text color (URL-encoded hex) | `#222` |
| `bg` | Background color or `transparent` | `transparent` |

This feature is enabled by default on all three CV templates when `showContacts` is enabled in system settings.
