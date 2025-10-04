# PPanayotov.com

**PPanayotov.com** is an open-source, minimalist personal website and CV builder. It allows individuals to create a clean, professional online presence without the complexity of databases or heavy infrastructure. Ideal for developers, freelancers, and anyone looking to maintain a simple digital profile.

---

## ✨ Features

- **Database-less architecture**  
  No database is required. All content is managed through editable files, making it lightweight and easy to deploy.

- **Secure Admin Panel**  
  A basic admin panel is available, secured by a password stored in a `.env` file.

- **Instant Deployment**  
  Compatible with serverless platforms like [Vercel](https://vercel.com), allowing fast, free deployment with minimal setup.

- **Clean UI with Expandable Sections**  
  Designed for clarity and professionalism, with optional future sections for customization.

- **AI-Assisted Content Enhancement**  
  Includes AI-powered tools to help polish and improve CV content, job descriptions, and professional summaries.

- **Image Upload with Optimization**  
  Upload and automatically optimize profile images for web display. *(PDF export optimization temporarily disabled)*

- **Modern Component Library**  
  Built using a comprehensive collection of accessible UI components based on Radix UI.

> ⚠️ **Security Note:**  
> It is strongly recommended not to upload the `admin/` folder to your production server unless properly secured. You can run the admin interface locally or restrict access during deployment.

---

## 🚧 To-Do

Planned features under development:

- [x] Add image upload support with optimization for web and PDF
- [x] Add AI assistance to improve and polish CV text
- [x] Add settings file
- [x] Add schema.org for the home page
- [ ] Expand contact and social media link options
- [ ] Introduce multiple visual templates for printable CVs *(work in progress - print functionality temporarily disabled)*
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
  /admin        → Admin panel pages and API routes
/components     → Reusable UI and admin components
  /admin        → Admin-specific components including AI-enhanced inputs
  /ui           → Reusable UI components based on Radix UI
/data           → Static data files (CV, skills, user profile)
/hooks          → Custom React hooks
/lib            → Utility functions and helpers
/public         → Static assets (images, icons, etc.)
  /fonts        → Font files for image generation or custom web fonts
  /uploads      → User-uploaded images with optimized versions
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

```
# Admin authentication
ADMIN_PASSWORD=your-secure-password

# OpenRouter API for AI features
OPENROUTER_KEY=your-openrouter-api-key
OPENROUTER_MODEL=openai/gpt-4.1-nano
```
