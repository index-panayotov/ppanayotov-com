# Contributing to Personal CV Website

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing to the codebase.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Architecture Decisions](#architecture-decisions)

## Getting Started

This is a **database-less Next.js personal CV website** with a secure admin panel. All data persists in static TypeScript files instead of a database, making it lightweight and deployable to serverless platforms.

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ppanayotov-com
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Configure required variables:
   ```env
   # Admin Panel (Required)
   ADMIN_PASSWORD=your-secure-password-min-8-chars

   # OpenRouter API (Required for AI features)
   OPENROUTER_KEY=sk-or-v1-your-api-key-here
   OPENROUTER_MODEL=openai/gpt-4.1-nano

   # Environment
   NODE_ENV=development
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/                    # Next.js App Router (pages, layouts, API routes)
│   ├── api/               # API endpoints
│   │   ├── admin/         # Admin CRUD operations
│   │   ├── ai/            # AI enhancement endpoints
│   │   └── upload/        # File upload handlers
│   ├── admin/             # Admin panel pages (dashboard, profile-data, experiences, settings, blog)
│   ├── blog/              # Blog pages (listing, individual posts)
│   ├── templates/         # CV template components (classic, professional, modern)
│   └── page.tsx           # Homepage (template selector)
│
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── blog/             # Blog-specific components
│   └── ui/               # Reusable UI components (Radix-based)
│
├── data/                 # Static data files ("database")
│   ├── cv-data.ts        # Work experience entries
│   ├── user-profile.ts   # Personal information
│   ├── system_settings.ts # Feature toggles
│   ├── topSkills.ts      # Featured skills
│   ├── blog-posts.ts     # Blog metadata
│   └── blog/             # Markdown blog content files
│
├── lib/                  # Utility functions and helpers
│   ├── data-loader.ts    # Data loading utilities
│   ├── markdown-utils.ts # Markdown/EditorJS conversion
│   ├── env.ts            # Environment variable validation
│   ├── logger.ts         # Structured logging
│   ├── seo/              # SEO utilities (meta generation, structured data)
│   ├── security/         # Security utilities (slug validation)
│   └── __tests__/        # Utility function tests
│
├── services/             # External API integrations
│   └── openrouter.ts     # OpenRouter AI service
│
├── types/                # TypeScript type definitions
│   └── *.ts              # Shared type definitions
│
└── public/               # Static assets
    └── uploads/          # Uploaded images (git-ignored)
```

## Development Workflow

### Working with Data Files

**IMPORTANT:** This project uses file-based data storage instead of a database. All data modifications should go through the admin interface when possible.

1. **CV Data** (`data/cv-data.ts`):
   - Add/edit work experience entries
   - Use structured format with title, company, dateRange, description, tags

2. **User Profile** (`data/user-profile.ts`):
   - Personal information, contact details, social links
   - **NEVER** add hardcoded fallback values in components

3. **System Settings** (`data/system_settings.ts`):
   - Global feature toggles (blog, WYSIWYG, analytics)
   - Controls navigation and feature visibility

4. **Blog Posts**:
   - Metadata in `data/blog-posts.ts`
   - Content as markdown files in `data/blog/*.md`
   - Organized uploads in `public/uploads/blog/{slug}/`

### Adding New Features

1. **Follow existing patterns:**
   - Study similar components in `/components/admin/` for admin features
   - Use AI-enhanced components for content inputs
   - Implement Zod schemas for form validation

2. **Update documentation:**
   - Add feature description to `CLAUDE.md`
   - Update `README.md` if user-facing
   - Document API routes and data structures

3. **Manual testing:**
   - Test new functionality thoroughly
   - Test security-critical code (validation, sanitization)
   - Testing framework planned for future implementation

4. **Update sitemap:**
   - Modify `/app/sitemap.xml/route.ts` for new public sections
   - Ensure proper priorities and change frequencies

## Template Development

The application supports multiple CV templates. Each template is a React component that receives the same props but renders them differently.

### Creating a New Template

1. **Create the template component:**
   ```bash
   touch app/templates/my-template.tsx
   ```

2. **Implement the TemplateProps interface:**
   ```typescript
   // app/templates/my-template.tsx
   import { TemplateProps } from './types';

   export default function MyTemplate({
     experiences,
     topSkills,
     profileData,
     systemSettings
   }: TemplateProps) {
     return (
       <div className="my-template">
         <header>
           <h1>{profileData.name}</h1>
           <p>{profileData.bio}</p>
         </header>

         <section>
           <h2>Experience</h2>
           {experiences.map(exp => (
             <div key={exp.company}>
               <h3>{exp.title}</h3>
               <p>{exp.company}</p>
             </div>
           ))}
         </section>

         <section>
           <h2>Skills</h2>
           {topSkills.map(skill => (
             <span key={skill}>{skill}</span>
           ))}
         </section>
       </div>
     );
   }
   ```

3. **Add template metadata:**
   ```typescript
   // app/templates/template-registry.ts
   export const TEMPLATE_METADATA = {
     // ... existing templates
     mytemplate: {
       id: 'mytemplate',
       name: 'My Template',
       description: 'Description of your template',
       preview: '/template-previews/mytemplate.png',
       features: [
         'Key feature 1',
         'Key feature 2',
         'Key feature 3'
       ],
       bestFor: ['Industry 1', 'Role type 1', 'Use case 1']
     }
   };
   ```

4. **Register the template:**
   ```typescript
   // app/templates/template-registry.ts
   const TEMPLATE_COMPONENTS = {
     // ... existing templates
     mytemplate: () => import('./my-template')
   };
   ```

5. **Update TypeScript types:**
   ```typescript
   // app/templates/types.ts
   export type TemplateId = 'classic' | 'professional' | 'modern' | 'mytemplate';
   ```

6. **Test your template:**
   - Update `data/system_settings.ts`: `selectedTemplate: "mytemplate"`
   - Run `npm run dev` and verify the template renders correctly
   - Test with different data scenarios (empty fields, long text, many entries)

### Template Best Practices

- **Responsive Design**: Ensure mobile, tablet, and desktop layouts work
- **Accessibility**: Use semantic HTML, ARIA labels, proper heading hierarchy
- **Performance**: Avoid heavy animations, optimize images, use CSS transforms
- **Data Flexibility**: Handle missing/optional data gracefully
- **Consistent Styling**: Use Tailwind classes or CSS custom properties
- **Professional Appearance**: Follow design principles for the target industry

## Coding Standards

### TypeScript

- **Strict mode**: Use TypeScript strictly (no `any` types unless absolutely necessary)
- **Type definitions**: Define types in `/types/` directory
- **Interfaces**: Use interfaces for data structures, types for unions/utilities

### Component Structure

```typescript
// components/example-component.tsx
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ExampleComponentProps {
  title: string;
  description?: string;
}

export function ExampleComponent({ title, description }: ExampleComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {description && (
        <CardContent>
          <p>{description}</p>
        </CardContent>
      )}
    </Card>
  );
}
```

### Styling

- **Tailwind CSS**: Use utility classes for styling
- **Responsive design**: Mobile-first approach
- **CSS custom properties**: Use for theming and consistency
- **Professional colors**: Slate-based palette, avoid bright blues/purples

### File Naming

- **Components**: `kebab-case.tsx` (e.g., `user-profile-card.tsx`)
- **Utilities**: `kebab-case.ts` (e.g., `markdown-utils.ts`)
- **Types**: `kebab-case.ts` (e.g., `blog-types.ts`)
- **Tests**: `*.test.ts` or `*.test.tsx` in `__tests__/` directories

## Code Quality Guidelines

### Manual Testing

Since automated testing has been removed, thorough manual testing is essential:

1. **Functionality Testing**:
   - Test all CRUD operations in admin panel
   - Verify data persistence across page reloads
   - Test image uploads with various file types
   - Verify AI enhancement features

2. **Template Testing**:
   - Test all 3 templates with your data
   - Verify responsive design on mobile/tablet/desktop
   - Test with missing/optional data fields
   - Verify animations and interactions

3. **Security Testing**:
   - Verify environment validation fails correctly
   - Test image upload validation (try uploading .exe, .pdf, etc.)
   - Verify admin authentication
   - Test slug validation for blog posts

4. **Performance Testing**:
   - Run Lighthouse audit (aim for 90+ scores)
   - Test lazy loading behavior
   - Verify PWA functionality
   - Check bundle size with `npm run analyze`

### Code Review Checklist

- **TypeScript**: No `any` types, proper interfaces defined
- **Error Handling**: Try-catch blocks, proper error messages
- **Logging**: Use `logger` instead of `console.log`
- **Security**: Input validation, sanitization, authentication
- **Performance**: Lazy loading, optimized images, efficient queries
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## Commit Guidelines

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no functional changes)
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic changes)
- `perf`: Performance improvements
- `chore`: Maintenance tasks (dependencies, config)

### Examples

```
feat: Add RSS feed for blog posts

Implement standards-compliant RSS 2.0 feed with XML escaping,
featured images, and 1-hour cache headers.

Closes #42
```

```
fix: Prevent image upload spoofing with magic number validation

Add isValidImageFile() function that checks file signatures
instead of relying on MIME types. Rejects PDFs, ZIPs, EXEs
masquerading as images.
```

```
test: Add comprehensive tests for markdown utilities

Add 20+ tests covering editorJsToMarkdown, markdownToEditorJs,
slug generation, and reading time calculation.
```

## Pull Request Process

### Before Submitting

1. **Manual testing:** Test all affected functionality thoroughly
2. **Lint code:** `npm run lint`
3. **Test build:** `npm run build`
4. **Lighthouse audit:** Ensure performance/accessibility scores remain high
5. **Update documentation:** Modify `CLAUDE.md` and `README.md` as needed

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] New template
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Build tested locally
- [ ] Lighthouse scores verified (if UI changes)
- [ ] Multiple templates tested (if template/data changes)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Documentation updated (CLAUDE.md, README.md)
- [ ] No console.log() statements (use logger)
- [ ] Environment variables documented in .env.example
- [ ] TypeScript types properly defined
```

### Review Process

1. **Automated checks:** All CI checks must pass (lint, build)
2. **Code review:** At least one approval required
3. **Manual testing:** Reviewer should test changes locally
4. **Documentation:** Verify documentation is complete
5. **Template testing:** If templates affected, test all 3 templates

## Architecture Decisions

### Critical Constraints

#### 1. Contact Information Security
- **NEVER** make email/phone clickable
- **ALWAYS** use text-to-image API (`/api/text-image`)
- **NO** `mailto:` or `tel:` links anywhere

#### 2. Data Integrity
- **ALL** personal data from `/data/user-profile.ts`
- **NO** hardcoded fallback values
- **CONDITIONAL** rendering for optional data

#### 3. Print Functionality
- **COMPLETELY REMOVED** - do not re-implement
- **NO** print-related CSS classes (`print:*`)
- **WEB-ONLY** focus

### Design Principles

1. **Database-less Architecture:**
   - All data in TypeScript files
   - Version control tracks content changes
   - Static generation for performance

2. **Security First:**
   - Environment validation at startup
   - Magic number validation for uploads
   - Input sanitization (Zod schemas)
   - Slug validation for path traversal prevention

3. **Performance Optimization:**
   - Lazy loading components
   - Image optimization (Sharp)
   - Efficient animations (CSS transforms)
   - Caching headers on static routes

4. **Maintainability:**
   - Structured logging
   - Comprehensive testing
   - Type safety (TypeScript)
   - Clear documentation

### When to Use Specific Tools

- **Logging:** Use `logger` instead of `console.log` for all production code
- **Validation:** Always use Zod schemas for form inputs and API requests
- **AI Enhancement:** Only for content improvement, not for user data
- **Slug Validation:** Always validate user-provided slugs to prevent path traversal

## Claude Code Configuration

This project supports [Claude Code](https://claude.ai/code) for AI-assisted development.

### Settings Policy

- **`.claude/settings.local.json`** - Local-only, git-ignored
  - Contains user-specific permission preferences
  - Each developer configures their own allowed commands
  - Never commit this file to the repository

- **`.claude/settings.json`** - Shared settings (if created)
  - Would contain team-wide defaults
  - Currently not used; all settings are local

### Recommended Local Permissions

When using Claude Code, you may want to allow these safe operations:

```json
{
  "permissions": {
    "allow": [
      "WebSearch",
      "Bash(npm run lint)",
      "Bash(npm run build)",
      "Bash(git status)",
      "Bash(git log:*)",
      "Bash(git diff:*)"
    ]
  }
}
```

**Security Notes:**
- Avoid broad wildcards like `Bash(npm install:*)` - install packages manually
- Avoid `Bash(sed:*)` or `Bash(cat:*)` - use Claude's built-in file tools instead
- Review each permission request before allowing

## Questions?

For questions about contributing, please:
1. Check `CLAUDE.md` for architectural guidance
2. Review existing code patterns
3. Open a GitHub issue for clarification

Thank you for contributing!
