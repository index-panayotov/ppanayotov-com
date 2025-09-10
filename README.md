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

You can deploy this project to [Vercel](https://vercel.com) with one click:

1. Push your forked repository to GitHub.
2. Go to [vercel.com/import](https://vercel.com/import) and import your GitHub project.
3. Set the `ADMIN_PASSWORD` environment variable in Vercel.
4. Deploy and enjoy your personal CV site.

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
