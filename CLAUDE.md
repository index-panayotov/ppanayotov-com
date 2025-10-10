# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production (TypeScript/ESLint errors ignored)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (for code quality checks)

**Important:** The build process ignores TypeScript and ESLint errors (configured in next.config.mjs) for deployment flexibility.

## Architecture Overview

This is a **database-less Next.js personal CV website** with a secure admin panel. All data persists in static TypeScript files instead of a database, making it lightweight and deployable to serverless platforms like Vercel.

### Core Architecture Principles

**Database-less Design:**
- All CV data stored as TypeScript files in `/data/` directory
- Content changes require file modifications, not database updates
- Static generation enables fast loading and easy deployment
- Version control tracks all content changes

**Admin Panel Security:**
- Password-protected admin interface at `/app/admin/`
- Authentication via environment variable (`ADMIN_PASSWORD`)
- Should NOT be deployed to production unless properly secured
- All admin routes protected by middleware

### Data Layer Structure

**Primary Data Files:**
- `data/cv-data.ts` - Experience entries with structured format:
  ```typescript
  {
    title: string,
    company: string, 
    dateRange: string,
    location?: string,
    description: string,
    tags: string[]
  }
  ```
- `data/user-profile.ts` - Personal information, contact details, social links
- `data/system_settings.ts` - Global feature toggles (blog, WYSIWYG, analytics, contacts, print, selectedTemplate, PWA config)
- `data/topSkills.ts` - Featured skills for homepage display
- `data/editorjs-config.ts` - Rich text editor configuration
- `data/blog-posts.ts` - Blog post metadata (when blogEnable: true)
- `data/blog/*.md` - Blog content files (markdown format)

### API Architecture

**Admin Routes (`/app/api/admin/`):**
- `login/route.ts` - Password authentication
- `route.ts` - Data CRUD operations for CV content
- `autoskills/route.ts` - AI-powered skill extraction and management
- `blog/route.ts` - Blog post CRUD operations (create, read, update, delete)

**AI Integration (`/app/api/ai/`):**
- `route.ts` - OpenRouter API integration for content enhancement
- Supports multiple AI models via OPENROUTER_MODEL env var
- Handles context-aware content improvements

**File Management:**
- `/app/api/upload/route.ts` - Image upload with Sharp optimization
- `/app/api/upload/blog/route.ts` - Blog-specific file uploads (images, attachments)
- `/app/api/text-image/route.ts` - Contact protection via text-to-image generation
- `/app/sitemap.xml/route.ts` - Dynamic SEO sitemap generation from data files (includes blog URLs)
- Automatic image optimization for web (400x400 WebP)

### Component Architecture

**Admin Components (`/components/admin/`):**
- `ai-enhanced-input.tsx` / `ai-enhanced-textarea.tsx` - AI-powered content editing
- `profile-data-tab.tsx` - Personal information management
- `experiences-tab.tsx` - Work experience CRUD interface
- `top-skills-tab.tsx` - Skills management with AI extraction
- `image-upload.tsx` - Drag-and-drop image handling with optimization
- `editorjs-wrapper.tsx` - Rich text editor integration for CV descriptions
- `blog-editorjs-wrapper.tsx` - EditorJS wrapper for blog with image upload support
- `blog-post-dialog.tsx` - Blog post create/edit dialog with WYSIWYG editor
- `blog-delete-dialog.tsx` - Blog post deletion confirmation
- `admin-navigation.tsx` - Admin panel navigation with Blog link

**UI Components (`/components/ui/`):**
- Based on Radix UI primitives with Tailwind styling
- Fully accessible and customizable design system
- Includes form components, dialogs, tables, and layout elements

### AI Enhancement System

**OpenRouter Integration:**
- Configurable AI models via `OPENROUTER_MODEL` environment variable
- Context-aware content improvement suggestions
- Skills extraction from job descriptions
- Professional tone optimization for CV content

**AI-Enhanced Workflows:**
- One-click content improvement for descriptions
- Automatic skill tag generation from experience text
- Professional writing assistance across all CV sections

### Image Management System

**Upload Pipeline:**
- Files stored in `/public/uploads/` (git-ignored by default)
- Sharp library handles server-side optimization
- Automatic generation of web and PDF-optimized versions
- Support for drag-and-drop and URL-based images

**Optimization Strategy:**
- Web display: 400x400px WebP at 85% quality
- PDF export: 200x200px WebP at 80% quality
- Original files preserved for future re-processing

### Environment Configuration

**Required Variables:**
```env
ADMIN_PASSWORD=your-secure-password
OPENROUTER_KEY=your-openrouter-api-key
OPENROUTER_MODEL=openai/gpt-4.1-nano
```

**Optional Features:**
- Google Tag Manager integration via `gtagCode` in system_settings.ts
- Feature toggles for blog, WYSIWYG editor, contacts display

### Development Patterns

**File Organization:**
- `/app/` - Next.js App Router structure (pages, layouts, API routes)
  - `/admin/` - Admin panel pages (dashboard, profile-data, experiences, settings, top-skills, blog)
  - `/api/` - Backend API routes
  - `/blog/` - Blog pages (listing, individual posts)
  - `/templates/` - CV template components (classic, professional, modern)
- `/components/` - Reusable UI and admin-specific components
- `/data/` - Static data files (the "database")
- `/lib/` - Utility functions and helpers
- `/services/` - External API integrations and business logic
- `/types/` - TypeScript type definitions

**State Management:**
- No external state management library
- React state for UI interactions
- File-based persistence for all content
- Form state managed with react-hook-form + zod validation

**Styling Approach:**
- Tailwind CSS for utility-first styling
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Dark/light theme support via next-themes

### Key Implementation Details

**Admin Authentication Flow:**
1. User enters password at `/admin/login`
2. Password validated against `ADMIN_PASSWORD` env var
3. Session stored in browser (no server-side sessions)
4. All admin routes protected by middleware

**Content Update Process:**
1. Admin modifies content through UI
2. API routes update corresponding files in `/data/`
3. Next.js automatically rebuilds affected pages
4. Changes persist in file system (not database)

**Image Upload Flow:**
1. User uploads via drag-and-drop or file picker
2. Sharp processes and optimizes images
3. Multiple versions saved to `/public/uploads/`
4. File paths stored in user profile data

### Deployment Considerations

**Vercel Deployment:**
- Set environment variables in Vercel dashboard
- `/public/uploads/` excluded from git (use `.gitignore`)
- Admin panel should be removed or secured for production
- Build process ignores TypeScript/lint errors for deployment flexibility

**File Persistence:**
- Uploaded images not committed to git by default
- Use `git add public/uploads/profile-* -f` to commit images if needed
- Consider external image hosting for production deployments

## Recent Major Work Completed

### Homepage Professional Redesign (2025)
**Complete UI/UX Overhaul:**
- **Professional Color Scheme**: Replaced bright blues/purples with subtle slate-based gradients
- **Modern Animations**: Added fadeInUp animations, shimmer loading effects, and typing animations
- **Enhanced Responsiveness**: Mobile-first design with optimized touch targets and typography
- **Accessibility Improvements**: Comprehensive ARIA labels, semantic HTML, skip links
- **Performance Optimization**: Lazy loading, efficient animations, reduced bundle size

**Design System Updates:**
- **CSS Custom Properties**: Professional color variables in `:root`
  ```css
  --cv-hero-gradient-from: 220 30% 25%;
  --cv-hero-gradient-to: 220 35% 35%;
  --cv-section-bg: 210 20% 98%;
  ```
- **Component Classes**: Standardized `.cv-section`, `.cv-card`, `.cv-skill-tag`, `.cv-button-*`
- **Animation Framework**: CSS keyframes for `fadeInUp`, `slideInLeft`, `shimmer` effects
- **Mobile Optimization**: Touch-friendly targets, improved spacing, responsive typography

### Print/PDF Functionality Removal
**Complete Cleanup Performed:**
- **Removed All Print Code**: No print/PDF functionality exists (temporarily disabled)
- **Cleaned CSS**: Removed all `print:*` Tailwind classes throughout application
- **Simplified Components**: Web-only focus, no print-specific rendering
- **Updated README**: Documented current status as "work in progress - print functionality temporarily disabled"

⚠️ **IMPORTANT**: Print functionality has been completely removed. Do not re-implement without explicit user request.

### Contact Protection System
**Bot-Protected Contact Information:**
- **Text-to-Image API**: `/api/text-image/route.ts` generates contact images using Canvas API
- **Non-Clickable Display**: Email/phone visible as images but not actionable
- **Security Implementation**:
  ```jsx
  <img
    src={`/api/text-image?fieldType=email&size=16&color=%23059669&bg=transparent`}
    alt="Email address (protected from bots)"
    className="protected-image"
    draggable={false}
  />
  ```
- **No mailto: Links**: Email completely non-clickable for bot protection

⚠️ **CRITICAL**: Email must remain non-clickable. Never add `mailto:` links or clickable contact info.

### SEO & Sitemap System
**Dynamic Sitemap Generation:**
- **Route**: `/app/sitemap.xml/route.ts` - Next.js App Router dynamic XML generation
- **Data-Driven**: Pulls content from `/data/` folder files for SEO optimization
- **Professional Keywords**: Extracts skills and experience tags for search optimization
- **File Timestamps**: Uses actual file modification dates for `lastmod` values
- **Feature-Aware**: Conditionally includes sections based on `system_settings.ts`
- **Cache Optimized**: 24-hour cache headers for performance

**SEO Implementation**:
```typescript
// Professional keywords extraction from data
const keywords = [...experienceKeywords, ...topSkills];

// Dynamic URLs with priorities
const urls = [
  { loc: '/', priority: '1.0', changefreq: 'monthly' },
  { loc: '/#experience', priority: '0.9', changefreq: 'quarterly' },
  { loc: '/#skills', priority: '0.8', changefreq: 'quarterly' }
];
```

**SEO Benefits**:
- Professional profile indexing with location (Sofia, Bulgaria)
- Technical skills visibility for relevant searches
- Experience-based keyword optimization
- Structured CV section discovery

### Data Integrity Improvements
**Eliminated All Hardcoded Fallbacks:**
- **Removed Hardcoded Values**: No `"preslav.panayotov@gmail.com"` or `"www.linkedin.com/in/preslav-panayotov"` anywhere
- **Data-First Approach**: ALL personal information sourced from `/data/user-profile.ts`
- **Conditional Rendering**: LinkedIn only shows if data exists (no fallbacks)
- **Structured Data**: Updated schema.org implementation to use conditional values

## Current Project Status & Configuration

### System Settings Configuration
**Current Configuration:**
```typescript
// In data/system_settings.ts
const systemSettings = {
  blogEnable: true,           // Blog system enabled
  useWysiwyg: true,           // EditorJS WYSIWYG editor enabled
  showContacts: true,         // Contact information displayed
  showPrint: false,           // Print functionality disabled
  gtagCode: "G-NR6KNX7RM6",  // Google Tag Manager code
  gtagEnabled: true,          // Analytics enabled
  selectedTemplate: "modern", // Active CV template (classic/professional/modern)
  pwa: {
    siteName: "CV Website",
    shortName: "CV",
    description: "",
    startUrl: "/",
    display: "standalone",
    backgroundColor: "#ffffff",
    themeColor: "#0f172a",
    orientation: "portrait-primary",
    categories: [],
    icons: []
  }
};
```

### Component Architecture Updates
**New Components Added:**
- `components/typing-effect.tsx` - Animated typing effect for hero section
- Enhanced `components/loading-skeleton.tsx` - Professional shimmer animations
- Updated contact protection patterns throughout

**Removed Components:**
- All print-related functionality and components
- Print QR code generation
- Print-specific layouts and styling

### Blog Feature System (2025)

**Complete Blog Implementation:**
- **File-Based Blog**: Blog posts stored as markdown files in `/data/blog/` with metadata in `/data/blog-posts.ts`
- **WYSIWYG Editor**: EditorJS integration in admin panel for rich content editing
- **Image Uploads**: Dedicated upload API for blog images (up to 5MB) with automatic WebP optimization
- **Markdown Storage**: Content stored as `.md` files, converted to/from EditorJS format
- **SEO Optimized**: Full metadata, Open Graph tags, Twitter Cards, JSON-LD structured data
- **Draft/Publish Workflow**: Toggle published status to control visibility
- **Auto Features**: Slug generation from titles, reading time calculation, tag management

**Blog Architecture:**
- **Data Files**:
  - `/data/blog-posts.ts` - Array of blog post metadata (title, description, tags, dates, etc.)
  - `/data/blog/{slug}.md` - Individual markdown content files per post
  - `/public/uploads/blog/{slug}/` - Blog-specific image uploads organized by post

- **Admin Interface** (`/admin/blog`):
  - Blog post listing with published/draft badges
  - Create new blog posts with EditorJS WYSIWYG editor
  - Edit existing posts (loads markdown → EditorJS → markdown on save)
  - Delete posts with cleanup of markdown files and uploaded images
  - Image upload directly in editor (drag & drop support)

- **Public Pages**:
  - `/blog` - Blog listing page (shows only published posts, sorted by date)
  - `/blog/[slug]` - Individual post pages with full SEO metadata
  - Responsive design matching site aesthetics
  - Markdown rendered with syntax highlighting, tables, images support

- **API Routes**:
  - `/api/admin/blog` - CRUD operations (GET, POST, PUT, DELETE)
  - `/api/upload/blog` - File uploads with slug-based organization

- **Utilities**:
  - `lib/markdown-utils.ts` - Bidirectional EditorJS ↔ Markdown conversion
  - `lib/data-loader.ts` - `loadBlogPosts()` and `loadBlogPost(slug)` helpers
  - `components/blog/markdown-renderer.tsx` - Styled markdown rendering

**Blog Configuration:**
```typescript
// In data/system_settings.ts
const systemSettings = {
  blogEnable: true, // Set to true to enable blog features
  // ... other settings
};
```

**Navigation Integration:**
- **Classic Template**: Blog link appears in desktop nav when `blogEnable: true`
- **Mobile Menu**: Blog link appears in mobile navigation when enabled
- **Modern/Professional Templates**: No navigation (single-page designs)

**Blog Post Schema:**
```typescript
{
  slug: string,              // URL-safe slug (auto-generated from title)
  title: string,             // Post title
  description: string,       // SEO description (50-160 chars recommended)
  publishedDate: string,     // Publication date (YYYY-MM-DD)
  updatedDate?: string,      // Last updated date
  author: string,            // Author name
  tags: string[],            // Post tags/categories
  featuredImage?: string,    // Featured image URL
  published: boolean,        // Visibility status
  readingTime?: number       // Auto-calculated reading time (minutes)
}
```

**EditorJS Tools Configured:**
- Header (H1-H6)
- Paragraph
- List (ordered/unordered)
- Code blocks with syntax highlighting
- Quotes with attribution
- Images (with upload support)
- Tables
- Horizontal delimiters

**SEO Features:**
- Dynamic metadata generation per post
- Open Graph tags for social sharing
- Twitter Card support
- JSON-LD structured data (schema.org BlogPosting)
- Canonical URLs
- Auto-included in sitemap.xml when `blogEnable: true`

### Infrastructure & Quality Improvements (2025)

**Environment Variable Validation** (`lib/env.ts`):
- **Type-Safe Configuration**: Zod-based validation of all environment variables at startup
- **Fail-Fast Strategy**: Application won't start with invalid/missing configuration
- **Clear Error Messages**: Detailed validation errors with specific requirements
- **TypeScript Autocomplete**: Fully typed environment variable access throughout codebase
- **Security Validation**: Enforces minimum password length, validates API key format
```typescript
import { env } from '@/lib/env';
// env.ADMIN_PASSWORD - typed and validated
// env.OPENROUTER_KEY - validated sk-or- prefix
```

**Structured Logging System** (`lib/logger.ts`):
- **Multi-Level Logging**: Debug (dev only), info, warn, error with metadata support
- **Production-Ready**: Hooks for external monitoring services (Sentry, LogRocket)
- **Contextual Data**: Attach metadata objects to all log entries
- **Error Tracking**: Dedicated error logging with stack trace preservation
```typescript
import { logger } from '@/lib/logger';
logger.info('Blog post created', { slug: 'my-post', author: 'John' });
logger.error('Upload failed', error, { fileSize: 5242880 });
```

**API Rate Limiting** (`lib/rate-limit.ts`):
- **Centralized Rate Limiting**: Reusable rate limit checking across all API routes
- **Per-IP Tracking**: In-memory storage with automatic cleanup of expired records
- **Standard HTTP Headers**: Returns proper `X-RateLimit-*` and `Retry-After` headers
- **Configurable Limits**: Customizable request count and time window per endpoint
- **AI Cost Protection**: Applied to `/api/ai` route (5 requests/minute)
```typescript
import { checkRateLimit } from '@/lib/rate-limit';
const { limited, remaining, resetAt } = checkRateLimit(req, 10, 60000);
```

**Blog Pagination** (`/app/blog/page.tsx`):
- **Performance Optimization**: Shows 10 posts per page to prevent performance issues at scale
- **Smart Pagination Controls**: Ellipsis display for many pages, disabled state handling
- **Post Count Display**: "Showing 1-10 of 25 posts" for user clarity
- **SEO-Friendly URLs**: URL parameter-based (`?page=2`) for proper indexing
- **Responsive Design**: Mobile-optimized Previous/Next buttons with page numbers

**RSS Feed** (`/app/feed.xml/route.ts`):
- **Standards-Compliant**: RSS 2.0 format with proper XML structure
- **Security**: XML escaping for all user-generated content
- **Rich Metadata**: Featured images, categories, reading time, publication dates
- **Performance**: 1-hour cache headers for optimal delivery
- **Discovery**: RSS link in blog header with Lucide icon
- **Auto-Generated**: Pulls from blog-posts.ts data automatically

**Blog Author Auto-Population**:
- **Smart Defaults**: Automatically populates blog author from user-profile.ts
- **No Hardcoded Values**: Eliminates "Your Name" placeholder
- **Fallback Strategy**: Uses "Anonymous" if profile not found
- **Logged Operations**: All auto-population events logged for debugging

**Enhanced Documentation**:
- **Comprehensive .env.example**: 67-line documented configuration file with security warnings
- **Getting Started Guide**: 5-step setup instructions
- **Vercel Deployment Instructions**: Production deployment guidance
- **Security Best Practices**: Password requirements, API key format, environment validation

### Template System (2025)

**Multi-Template CV Architecture:**
The application now supports 3 distinct CV templates, allowing users to choose the presentation style that best fits their industry and personal brand.

**Available Templates:**

1. **Classic Template** (`classic`)
   - **Style**: Animated, modern design with typing effects and smooth scrolling
   - **Features**:
     - Animated typing effect for hero section
     - Gradient hero backgrounds
     - Smooth scroll animations (fadeInUp, slideInLeft)
     - Professional slate-based color scheme
   - **Best For**: Tech industry, creative roles, modern companies
   - **File**: `app/templates/classic.tsx`

2. **Professional Template** (`professional`)
   - **Style**: Clean, minimal design optimized for ATS and traditional industries
   - **Features**:
     - ATS-scanner friendly layout
     - Print-optimized design
     - Clear typography hierarchy
     - Universal compatibility
   - **Best For**: All industries, corporate roles, traditional companies, job applications
   - **File**: `app/templates/professional.tsx`

3. **Modern Template** (`modern`)
   - **Style**: Bold, trendy design with vibrant colors and interactive elements
   - **Features**:
     - Glassmorphism effects
     - CSS Grid masonry layout
     - Dark mode support
     - Interactive hover states
   - **Best For**: Design roles, startups, creative industries, portfolio showcase
   - **File**: `app/templates/modern.tsx`

**Template Architecture:**

```typescript
// Template Props - consistent data structure for all templates
interface TemplateProps {
  experiences: ExperienceEntry[];
  topSkills: string[];
  profileData: UserProfile;
  systemSettings: SystemSettings;
}

// Template Metadata
interface TemplateMetadata {
  id: TemplateId;              // 'classic' | 'professional' | 'modern'
  name: string;                 // Display name
  description: string;          // Template description
  preview: string;              // Preview image path
  features: string[];           // Key features list
  bestFor: string[];            // Target industries/roles
}
```

**Template Registry** (`app/templates/template-registry.ts`):
- Centralized template metadata and component management
- Lazy-loading for optimal performance
- Helper functions: `getTemplateComponent()`, `getTemplateMetadata()`, `getAllTemplates()`, `isValidTemplateId()`

**Template Selection:**
- Set via `selectedTemplate` in `data/system_settings.ts`
- Valid values: `"classic"`, `"professional"`, `"modern"`
- Changes take effect immediately on homepage

**Creating New Templates:**
1. Create new component in `app/templates/{template-name}.tsx`
2. Implement `TemplateProps` interface
3. Add metadata to `TEMPLATE_METADATA` in `template-registry.ts`
4. Add lazy import to `TEMPLATE_COMPONENTS`
5. Update `TemplateId` type in `types.ts`

### Admin Panel Restructuring (2025)

**Modular Admin Pages:**
The admin panel has been restructured from a single monolithic page into separate, focused pages:

- **`/admin/dashboard`** - Overview and quick stats
- **`/admin/profile-data`** - Personal information management
- **`/admin/experiences`** - Work experience CRUD
- **`/admin/top-skills`** - Skills management with AI extraction
- **`/admin/settings`** - System settings configuration
- **`/admin/blog`** - Blog post management (if `blogEnable: true`)

**Unified Data Management:**
- Centralized data extraction logic in `app/admin/handlers.ts`
- Consistent error handling and loading states across all admin pages
- Improved component organization and separation of concerns
- Better performance with focused page loads

### Current Features Status
✅ **Active Features:**
- **Template System** - 3 professional CV templates (Classic, Professional, Modern) with easy switching
- **Modular Admin Panel** - Separate pages for dashboard, profile, experiences, skills, settings, blog
- Professional web-only CV presentation
- AI-enhanced content editing in admin
- Bot-protected contact information
- Image upload with web optimization
- Modern responsive design with animations
- Google Tag Manager integration
- **Dynamic SEO sitemap** - Auto-generated from data files (includes blog URLs)
- **Blog System** - Full-featured blog with WYSIWYG editor, markdown storage, SEO optimization
- **Environment Validation** - Type-safe, fail-fast configuration with Zod
- **Structured Logging** - Multi-level logging with metadata and error tracking
- **API Rate Limiting** - Per-IP tracking with standard HTTP headers
- **Blog Pagination** - 10 posts/page with smart controls
- **RSS Feed** - Standards-compliant RSS 2.0 with caching
- **Security** - Magic number validation for image uploads
- **PWA Support** - Configurable Progressive Web App settings

🚫 **Disabled Features:**
- Print/PDF functionality (completely removed)
- Any clickable contact information
- Hardcoded personal data fallbacks

## Development Best Practices

### ⚠️ CRITICAL CONSTRAINTS

**Contact Information Security:**
- **NEVER** make email/phone clickable or actionable
- **ALWAYS** use text-to-image API for contact display
- **NO** `mailto:` links or `tel:` links anywhere
- Email/phone should be visible but bot-protected

**Data Integrity:**
- **ALL** personal data must come from `/data/user-profile.ts`
- **NO** hardcoded fallback values (emails, LinkedIn, etc.)
- **CONDITIONAL** rendering for optional data (LinkedIn, etc.)

**Print Functionality:**
- **COMPLETELY REMOVED** - do not re-implement without user request
- **NO** print-related CSS classes (`print:*`)
- **WEB-ONLY** focus for all components and styling

### When Working with Data
- Always backup existing data before modifications
- Maintain TypeScript interfaces in `/types/` for data structures
- Use structured format for experience entries with proper tags
- Validate data changes through admin interface when possible
- **NEVER** add hardcoded personal information

### When Adding Features
- Follow existing patterns in `/components/admin/` for admin features
- Use AI-enhanced components for content-related inputs
- Implement proper form validation with zod schemas
- Test image upload functionality across different file types
- **RESPECT** contact protection constraints
- **SEO UPDATES**: When adding new sections, update sitemap route accordingly

### Code Quality
- Follow existing component patterns and naming conventions
- Use TypeScript strictly (despite build config ignoring errors)
- Maintain responsive design patterns established in existing components
- Leverage existing utility functions in `/lib/utils.ts`
- **MAINTAIN** professional design system consistency

### Design System Guidelines
**Color Scheme:**
- Use professional slate-based colors (avoid bright blues/purples)
- Leverage CSS custom properties for consistency
- Maintain accessibility contrast ratios

**Animations:**
- Use subtle, professional animations (fadeInUp, shimmer)
- Optimize for performance with CSS transforms
- Ensure animations enhance rather than distract

**Responsive Design:**
- Mobile-first approach with touch-friendly targets
- Optimize typography scales for different screen sizes
- Use modern CSS Grid and Flexbox patterns

### SEO & Sitemap Management
**Sitemap Maintenance:**
- **Auto-Generation**: Sitemap updates automatically when data files change
- **Professional Keywords**: Extracted from experience tags and skills for SEO
- **Priority Structure**: Homepage (1.0) > Experience (0.9) > Skills (0.8) > Other sections
- **Cache Strategy**: 24-hour cache for performance, refreshes daily
- **Validation**: Test sitemap XML at `/sitemap.xml` after data changes

**When Updating Data:**
- Experience changes automatically update sitemap lastmod dates
- New skills automatically included in sitemap keywords
- System settings changes affect sitemap URL inclusion
- File timestamps drive sitemap freshness indicators

**SEO Best Practices:**
- Professional keywords from actual experience and skills
- Location-based optimization (Sofia, Bulgaria)
- Technical expertise visibility for relevant searches
- Structured CV section indexing for better discoverability
- no need to run npm  commands, i will do that