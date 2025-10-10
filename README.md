# PPanayotov.com

**PPanayotov.com** is an open-source, minimalist personal website and CV builder. It allows individuals to create a clean, professional online presence without the complexity of databases or heavy infrastructure. Ideal for developers, freelancers, and anyone looking to maintain a simple digital profile.

---

## ✨ Features

- **Multi-Template CV System** ✨ NEW
  Choose from 3 professionally designed templates to match your industry:
  - **Classic**: Animated design with typing effects, perfect for tech and creative roles
  - **Professional**: ATS-optimized, print-friendly layout for traditional industries
  - **Modern**: Bold, trendy design with glassmorphism for creative portfolios
  Switch templates instantly via configuration - no code changes needed.

- **Database-less architecture**
  No database is required. All content is managed through editable files, making it lightweight and easy to deploy.

- **Modular Admin Panel**
  Password-protected admin interface with separate pages for profile, experiences, skills, settings, and blog management.

- **Instant Deployment**
  Compatible with serverless platforms like [Vercel](https://vercel.com), allowing fast, free deployment with minimal setup.

- **AI-Assisted Content Enhancement**
  Includes AI-powered tools to help polish and improve CV content, job descriptions, and professional summaries.

- **Image Upload with Optimization**
  Upload and automatically optimize profile images for web display with magic number validation for security.

- **Modern Component Library**
  Built using a comprehensive collection of accessible UI components based on Radix UI.

- **Full-Featured Blog System**
  WYSIWYG editor with EditorJS, markdown storage, pagination (10 posts/page), and RSS feed support.

- **Production-Ready Infrastructure**
  - **Structured Logging**: Multi-level logging with metadata for debugging production issues
  - **Type-Safe Environment**: Validated configuration with Zod for fail-fast startup
  - **API Rate Limiting**: Per-IP tracking with standard HTTP headers to prevent abuse
  - **Security**: Magic number validation for image uploads prevents file spoofing
  - **PWA Support**: Configurable Progressive Web App with offline capabilities

> ⚠️ **Security Note:**  
> It is strongly recommended not to upload the `admin/` folder to your production server unless properly secured. You can run the admin interface locally or restrict access during deployment.

---

## 🚧 To-Do

Planned features under development:

- [x] Add image upload support with optimization for web and PDF
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
/app            → Main application (routing, layouts, API, admin)
  /api          → Backend API routes
  /admin        → Admin panel pages (dashboard, profile-data, experiences, settings, blog)
  /blog         → Blog pages (listing, individual posts)
  /templates    → CV template components (classic, professional, modern)
/components     → Reusable UI and admin components
  /admin        → Admin-specific components including AI-enhanced inputs
  /blog         → Blog-specific components (markdown renderer)
  /ui           → Reusable UI components based on Radix UI
/data           → Static data files (CV, skills, user profile)
  /blog         → Blog content files (markdown format)
/hooks          → Custom React hooks
/lib            → Utility functions and helpers
/public         → Static assets (images, icons, etc.)
  /fonts        → Font files for image generation or custom web fonts
  /uploads      → User-uploaded images with optimized versions
    /blog       → Blog-specific uploads organized by post slug
/services       → API service integrations (e.g., OpenRouter)
/styles         → Global and component styles
/types          → TypeScript type definitions
.env            → Environment variables (e.g., admin password)
```

---

## 📦 Deployment

### Deploying to Vercel (Recommended)

**Prerequisites:**
1. **Generate PWA Icons**: Follow instructions in `/public/icons/GENERATE_ICONS.md` to create required icon files
2. **Test Locally**: Run `npm run build && npm run start` to ensure production build works
3. **(Optional) Commit Profile Images**: If using custom profile images, commit them to git or use external hosting

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

- [ ] PWA icons generated and committed
- [ ] Environment variables set in Vercel
- [ ] Production build tested locally
- [ ] Live site loads correctly
- [ ] PWA installation works (test on mobile)
- [ ] Admin panel blocked (or secured if enabled)
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)

### Deployment Troubleshooting

**Issue**: "PWA won't install"
- **Fix**: Ensure all icon files exist in `/public/icons/`

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

> **Note**: PDF export optimization is temporarily disabled while print functionality is being redesigned for better ATS compatibility and professional appearance.

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

### Rate Limiting
All API routes are protected with rate limiting to prevent abuse:
- **AI API** (`/api/ai`): 5 requests/minute
- **Profile Upload** (`/api/upload`): 10 uploads/minute
- **Blog Upload** (`/api/upload/blog`): 10 uploads/minute
- **Admin Data** (`/api/admin`): 30 GET requests/minute, 20 POST requests/minute
- **Autoskills** (`/api/admin/autoskills`): 20 requests/minute

Rate limits include standard HTTP headers (`X-RateLimit-*`, `Retry-After`) for proper client handling.

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
