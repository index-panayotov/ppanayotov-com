# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production (TypeScript/ESLint errors ignored)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint (for code quality checks)

**Important:** No test framework is configured. The build process ignores TypeScript and ESLint errors (configured in next.config.mjs).

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
- `data/system_settings.ts` - Global feature toggles (blog, WYSIWYG, analytics, contacts, print)
- `data/topSkills.ts` - Featured skills for homepage display
- `data/editorjs-config.ts` - Rich text editor configuration

### API Architecture

**Admin Routes (`/app/api/admin/`):**
- `login/route.ts` - Password authentication
- `route.ts` - Data CRUD operations for CV content
- `autoskills/route.ts` - AI-powered skill extraction and management

**AI Integration (`/app/api/ai/`):**
- `route.ts` - OpenRouter API integration for content enhancement
- Supports multiple AI models via OPENROUTER_MODEL env var
- Handles context-aware content improvements

**File Management:**
- `/app/api/upload/route.ts` - Image upload with Sharp optimization
- `/app/api/text-image/route.ts` - AI text-to-image generation
- Automatic image optimization for web (400x400 WebP) and PDF (200x200 WebP)

### Component Architecture

**Admin Components (`/components/admin/`):**
- `ai-enhanced-input.tsx` / `ai-enhanced-textarea.tsx` - AI-powered content editing
- `profile-data-tab.tsx` - Personal information management
- `experiences-tab.tsx` - Work experience CRUD interface
- `top-skills-tab.tsx` - Skills management with AI extraction
- `image-upload.tsx` - Drag-and-drop image handling with optimization
- `editorjs-wrapper.tsx` - Rich text editor integration

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

### Data Integrity Improvements
**Eliminated All Hardcoded Fallbacks:**
- **Removed Hardcoded Values**: No `"preslav.panayotov@gmail.com"` or `"www.linkedin.com/in/preslav-panayotov"` anywhere
- **Data-First Approach**: ALL personal information sourced from `/data/user-profile.ts`
- **Conditional Rendering**: LinkedIn only shows if data exists (no fallbacks)
- **Structured Data**: Updated schema.org implementation to use conditional values

## Current Project Status & Configuration

### System Settings Update Needed
**Current Setting Should Be Updated:**
```typescript
// In data/system_settings.ts - should be updated to:
const systemSettings = {
  blogEnable: false,
  useWysiwyg: true,
  showContacts: true,
  showPrint: false, // ← Should be false (currently true)
  gtagCode: "G-NR6KNX7RM6",
  gtagEnabled: true
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

### Current Features Status
✅ **Active Features:**
- Professional web-only CV presentation
- AI-enhanced content editing in admin
- Bot-protected contact information
- Image upload with web optimization
- Modern responsive design with animations
- Google Tag Manager integration

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