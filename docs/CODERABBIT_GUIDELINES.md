# CodeRabbit Review Guidelines

This document contains project-specific guidelines and learnings for CodeRabbit reviews.

## Project Context & Learnings

### Architecture
- This is a Next.js 15 App Router project with TypeScript
- Data is stored in static TypeScript files in `/data/` directory (no database)
- Admin panel should NOT be deployed to production unless secured
- Blog uses markdown files stored in `/data/blog/`
- Images are optimized using Sharp library
- Uses Incremental Static Regeneration (ISR) for blog pages

### Security & Privacy
- Contact information must remain non-clickable for bot protection (no `mailto:` or `tel:` links)
- Admin routes and API endpoints require security review

### Removed Features
- Print functionality has been completely removed (do not re-implement without explicit request)

## Custom Review Instructions

### Security
- Check for security issues in admin routes and API endpoints
- Verify that contact information remains non-clickable (no `mailto:` or `tel:` links)
- Ensure proper error handling in async operations
- Verify that admin panel changes don't affect public-facing pages

### Code Quality
- Ensure proper TypeScript types and avoid `any` where possible
- Verify Next.js 15 best practices (Server Components, async metadata, etc.)
- Check for performance issues (large bundle sizes, unnecessary re-renders)
- Ensure all data comes from `/data/` files, not hardcoded values

### Accessibility
- Check for accessibility (ARIA labels, semantic HTML, keyboard navigation)

### Performance
- Check for proper ISR/SSG configuration on blog pages
- Verify image optimization and lazy loading where appropriate

## Focus Areas

When reviewing pull requests, prioritize:
1. Security
2. Performance
3. Accessibility
4. Best practices
5. Type safety
