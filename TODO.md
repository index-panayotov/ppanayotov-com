# Project TODO & Technical Debt

This document tracks outstanding issues, recommended improvements, and technical debt for the ppanayotov-com CV website project.

**Last Updated:** 2025-10-20
**Status Legend:** 🔴 High Priority | 🟡 Medium Priority | 🟢 Low Priority | ⏱️ Estimated Effort

---

## ✅ Recently Completed (2025-10-20)

### Critical Security Fixes
- ✅ **FIXED CRITICAL XSS VULNERABILITY** in `components/ui/editor-js-renderer.tsx`
  - Added DOMPurify sanitization to all HTML rendering
  - Configured strict allowed tags/attributes policy
  - Prevents malicious script injection via EditorJS content
- ✅ **FIXED npm dependency vulnerabilities** - Patched tar-fs and brace-expansion
- ✅ **IMPLEMENTED RATE LIMITING** for admin login (`lib/rate-limit.ts`)
  - 5 failed attempts = 15-minute lockout
  - IP-based tracking with automatic cleanup
  - Detailed logging of login attempts
  - HTTP 429 responses with Retry-After headers

### Admin Panel Bug Fixes
- ✅ Fixed incorrect props passed to `AdminNavigation` in `blog/new/page.tsx`
- ✅ Fixed incorrect props passed to `AdminNavigation` in `blog/edit/[slug]/page.tsx`

### UX & Security Improvements
- ✅ **Enhanced .env.example** with comprehensive security warnings and documentation
- ✅ **Added client-side file upload validation** to blog EditorJS wrapper
  - 5MB file size limit enforced before upload
  - Supported format validation (JPG, PNG, WebP, GIF)
  - Better error messages for users

### Performance Optimizations
- ✅ Added Static Site Generation (SSG) to blog listing page with `generateStaticParams()`
- ✅ Implemented Incremental Static Regeneration (ISR) with 1-hour revalidation for blog pages
- ✅ Removed unnecessary empty wrapper div in blog listing page

### Development Infrastructure
- ✅ Created `.coderabbit.yaml` configuration for automated code reviews
- ✅ Comprehensive security audit completed
- ✅ Created reusable rate limiting utilities (`lib/rate-limit.ts`)

---

## 🔴 High Priority Issues

### 1. Production Admin Panel Security (PARTIALLY COMPLETED)
**Priority:** 🔴 Critical
**Effort:** ⏱️ 2-4 hours
**Category:** Security

**Issue:**
Admin panel is currently accessible in production builds with multiple security concerns:

1. **Weak Authentication:**
   - Plain text password comparison (no hashing)
   - Cookie-based auth without httpOnly/secure flags
   - No session management or token refresh

2. **Missing Security Controls:**
   - No rate limiting on login attempts (brute force vulnerability)
   - No CSRF protection on API routes
   - No audit logging for admin actions
   - No IP-based restrictions

3. **Authentication Code Issues** (`app/api/admin/login/route.ts`):
   ```typescript
   // SECURITY ISSUE: Plain text comparison
   if (password === adminPassword) {
     // No hashing, no timing-safe comparison
   }
   ```

**Completed:**
- ✅ Added rate limiting (5 failed attempts = 15 min lockout)
- ✅ Enhanced security documentation in .env.example

**Remaining Tasks:**
1. **Immediate (Before Production):**
   - Add environment check to completely disable admin routes in production
   - Implement CSRF tokens for all POST/PUT/DELETE requests (TODO #5)

2. **Short-term:**
   - Implement proper authentication (NextAuth.js recommended)
   - Add password hashing with bcrypt
   - Use httpOnly, secure cookies with SameSite=strict
   - Add session management with automatic expiry

3. **Long-term:**
   - Multi-factor authentication (MFA)
   - Audit logging to database or external service
   - IP allowlisting for admin access

**Files Affected:**
- `middleware.ts`
- `app/api/admin/login/route.ts`
- `app/admin/**`
- `app/api/admin/**`

**Example Rate Limiting Implementation:**
```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

const rateLimit = new LRUCache({
  max: 500,
  ttl: 60000, // 1 minute
});

export function checkRateLimit(ip: string): boolean {
  const attempts = rateLimit.get(ip) || 0;
  if (attempts >= 5) return false;
  rateLimit.set(ip, attempts + 1);
  return true;
}
```

---

### 3. Environment Variable Validation Missing in Build
**Priority:** 🔴 High
**Effort:** ⏱️ 30 minutes
**Category:** DevOps

**Issue:**
While `lib/env.ts` provides runtime validation, there's no validation during the build process. Missing environment variables can cause build failures in CI/CD.

**Recommendations:**
- Add prebuild script to validate environment variables
- Create `.env.example` with all required variables documented
- Add environment variable checks in `next.config.mjs`

**Implementation:**
```json
// package.json
"scripts": {
  "prebuild": "node scripts/validate-env.js",
  "build": "next build"
}
```

---

### 4. Outdated Dependencies with Breaking Changes
**Priority:** 🔴 High
**Effort:** ⏱️ 2-3 hours
**Category:** Maintenance & Security

**Issue:**
Several dependencies are significantly outdated with potential security fixes and breaking changes:

**Critical Updates:**
- `@hookform/resolvers`: 3.10.0 → 5.2.2 (major version jump)
- `@radix-ui/*`: Multiple components 2-3 major versions behind
- `@next/third-parties`: 15.3.3 → 15.5.6
- `@editorjs/editorjs`: 2.30.8 → 2.31.0

**Recommendations:**
1. Test each major version update in development first
2. Check migration guides for breaking changes
3. Run full test suite after updates (once tests are implemented)
4. Update in phases:
   - Phase 1: Minor/patch updates (low risk)
   - Phase 2: Major Radix UI updates (medium risk)
   - Phase 3: @hookform/resolvers (high risk - check API changes)

**Command:**
```bash
npm update              # Updates to wanted versions
npm outdated            # Check what's left
npm install <package>@latest  # Manual major version updates
```

**Files Affected:**
- `package.json`
- `package-lock.json`

---

---

## 🟡 Medium Priority Issues

### 5. CSRF Protection for Admin Routes
**Priority:** 🟡 Medium (was High - rate limiting partially addresses)
**Effort:** ⏱️ 2-3 hours
**Category:** Security

**Issue:**
Admin API routes lack CSRF (Cross-Site Request Forgery) protection. While rate limiting helps, CSRF tokens would provide additional security.

**Recommendations:**
- Implement CSRF tokens for all state-changing operations (POST, PUT, DELETE)
- Use a library like @edge-csrf/nextjs
- Add token validation in middleware

**Example Implementation:**
```typescript
// middleware.ts
import { createCsrfMiddleware } from '@edge-csrf/nextjs';

const csrfProtect = createCsrfMiddleware({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    name: '__Host-csrf',
    sameSite: 'strict',
  },
});

export function middleware(request: NextRequest) {
  // Apply CSRF protection to admin routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    return csrfProtect(request);
  }
  return NextResponse.next();
}
```

**Files Affected:**
- `middleware.ts`
- All admin API routes

---

### 6. Inconsistent Component Loading Patterns
**Priority:** 🟡 Medium
**Effort:** ⏱️ 2 hours
**Category:** Code Quality

**Issue:**
Some admin pages use lazy loading with Suspense (dashboard), others use direct imports (experiences, blog). This creates inconsistent bundle splitting.

**Recommendations:**
- Standardize on lazy loading for all admin pages
- Or remove lazy loading if not needed (admin pages aren't public)
- Document the decision in CLAUDE.md

**Files Affected:**
- `app/admin/dashboard/page.tsx`
- `app/admin/experiences/page.tsx`
- `app/admin/blog/page.tsx`
- All other admin pages

---

### 7. Missing Error Boundaries in Public Pages
**Priority:** 🟡 Medium
**Effort:** ⏱️ 1-2 hours
**Category:** UX & Reliability

**Issue:**
Only blog pages have error boundaries. Main CV page and other routes could crash the entire app if data loading fails.

**Recommendations:**
- Add error boundary to main layout
- Create custom error pages for 500 errors
- Add fallback UI for missing data
- Implement error tracking (Sentry, LogRocket)

**Files Affected:**
- `app/layout.tsx`
- `app/error.tsx` (create)
- `app/templates/**`

---

### 8. Unused Utility Function
**Priority:** 🟡 Medium
**Effort:** ⏱️ 5 minutes
**Category:** Code Quality

**Issue:**
`getBlogHeaderClasses()` in `lib/utils.ts` is imported but never used since BlogHeader is in the layout.

**Recommendations:**
- Remove the function if truly unused
- Or document its purpose if it's for future use
- Check for other unused utilities

**Files Affected:**
- `lib/utils.ts`
- `app/blog/page.tsx`
- `app/blog/[slug]/page.tsx`

---

### 9. No Automated Tests
**Priority:** 🟡 Medium
**Effort:** ⏱️ 8-16 hours
**Category:** Quality Assurance

**Issue:**
Project has zero test coverage. Critical admin functionality and data mutations are untested.

**Recommendations:**
- Add Jest + React Testing Library
- Write unit tests for:
  - Data loaders (`lib/data-loader.ts`)
  - API routes (`app/api/**`)
  - Utility functions (`lib/utils.ts`, `lib/markdown-utils.ts`)
- Add E2E tests with Playwright for:
  - Admin panel workflows
  - Blog post creation/editing
  - Image uploads

**Estimated Coverage Target:** 60-70% for critical paths

---

### 10. Blog SEO Could Be Enhanced
**Priority:** 🟡 Medium
**Effort:** ⏱️ 2-3 hours
**Category:** SEO

**Issue:**
Blog posts have basic SEO but could be improved with schema.org markup, better OG images, and Twitter cards.

**Recommendations:**
- Add JSON-LD schema for `BlogPosting`
- Generate OG images automatically (using @vercel/og)
- Add `article:published_time` and `article:author` meta tags
- Implement breadcrumb navigation
- Add `rel="prev"` and `rel="next"` for pagination

**Files Affected:**
- `app/blog/[slug]/page.tsx`
- `app/blog/page.tsx`

---

## 🟢 Low Priority / Nice-to-Have

### 11. Code Splitting Optimization
**Priority:** 🟢 Low
**Effort:** ⏱️ 2-3 hours
**Category:** Performance

**Issue:**
EditorJS and react-markdown could be further optimized with dynamic imports.

**Recommendations:**
- Analyze bundle size with `@next/bundle-analyzer`
- Split large dependencies (EditorJS tools, markdown renderers)
- Consider code splitting by route

---

### 12. TypeScript Strict Mode
**Priority:** 🟢 Low
**Effort:** ⏱️ 4-8 hours
**Category:** Code Quality

**Issue:**
TypeScript strict mode is not enabled. Some type safety features are missing.

**Recommendations:**
- Enable `strict: true` in `tsconfig.json`
- Fix all type errors incrementally
- Remove `ignoreBuildErrors: true` from `next.config.mjs`
- Enable ESLint type-aware rules

---

### 13. Accessibility Audit
**Priority:** 🟢 Low
**Effort:** ⏱️ 3-4 hours
**Category:** Accessibility

**Issue:**
No comprehensive accessibility audit has been performed.

**Recommendations:**
- Run Lighthouse accessibility audit
- Add automated accessibility testing (jest-axe)
- Test keyboard navigation
- Verify screen reader compatibility
- Add skip links for all pages
- Ensure proper heading hierarchy

---

### 14. Internationalization (i18n)
**Priority:** 🟢 Low
**Effort:** ⏱️ 8-16 hours
**Category:** Feature

**Issue:**
Site is English-only. Supporting multiple languages could broaden audience.

**Recommendations:**
- Add next-intl or next-translate
- Extract all strings to translation files
- Add language switcher
- Support RTL languages

---

## 📊 Technical Debt Summary

| Category | High Priority | Medium Priority | Low Priority | Total |
|----------|---------------|-----------------|--------------|-------|
| Security | 3 | 0 | 0 | 3 |
| Maintenance | 1 | 0 | 0 | 1 |
| Performance | 0 | 0 | 1 | 1 |
| Code Quality | 0 | 2 | 1 | 3 |
| UX | 1 | 1 | 0 | 2 |
| SEO | 0 | 1 | 0 | 1 |
| Testing | 0 | 1 | 0 | 1 |
| Accessibility | 0 | 0 | 1 | 1 |
| Features | 0 | 0 | 1 | 1 |
| DevOps | 1 | 0 | 0 | 1 |

**Total Issues:** 15 (6 High, 5 Medium, 4 Low)
**Critical Security Items:** 4 (1 fixed, 3 outstanding)

---

## 🚀 Recommended Action Plan

### IMMEDIATE (Today):
1. ✅ Fix critical XSS vulnerability in EditorJsRenderer (COMPLETED)
2. Run `npm audit fix` to patch dependency vulnerabilities (#1)

### Sprint 1: Critical Security (This Week)
3. Fix admin panel production security (#2)
   - Add rate limiting
   - Implement CSRF protection
   - Add environment-based route disabling
4. Add environment variable validation (#3)
5. Update outdated dependencies (#4)

### Sprint 2: Quality & Testing (Next 1-2 Weeks)
6. Add error boundaries to all routes (#7)
7. Set up automated testing framework (#9)
8. Write tests for critical security paths
9. Fix inconsistent loading patterns (#6)

### Sprint 3: UX & Performance (Weeks 3-4)
10. Add client-side upload validation (#5)
11. Enhance blog SEO (#10)
12. Bundle size optimization (#11)

### Sprint 4: Polish & Documentation (Month 2)
13. Clean up unused code (#8)
14. Accessibility audit (#13)
15. TypeScript strict mode (#12)
16. Internationalization (#14) - if needed

---

## 📝 Notes

### Security Audit Findings (2025-10-20)
- **CRITICAL XSS FIXED**: EditorJsRenderer was rendering unsanitized HTML - now uses DOMPurify
- **2 npm vulnerabilities** found (1 HIGH, 1 LOW) - both fixable with `npm audit fix`
- **Admin panel security** requires immediate attention before production deployment
- Image upload already has good security with magic number validation

### Code Quality Observations
- All completed items from 2025-10-20 are tracked in git commit history
- CodeRabbit is now configured for automated PR reviews
- ISR is set to 1-hour revalidation for blog pages
- Admin panel props bug was causing TypeScript errors but didn't affect functionality
- Good use of DOMPurify in ExperienceEntry component (proper security pattern)
- File upload security is well-implemented with magic number validation

### Performance Notes
- Blog pages now use SSG + ISR for optimal performance
- Bundle analyzer available via `npm run build:analyze`
- Consider lazy loading EditorJS components for better initial load

### Positive Findings
✅ Image upload security is excellent (magic number validation)
✅ Blog uses markdown with sanitization (MarkdownRenderer with rehype-sanitize)
✅ Environment variable validation with Zod
✅ Good error handling patterns in API routes
✅ Comprehensive logging system implemented

---

## 🔗 Related Documentation

- [CLAUDE.md](./CLAUDE.md) - Development guidelines
- [README.md](./README.md) - Project overview
- [.coderabbit.yaml](./.coderabbit.yaml) - Code review configuration
- [GEMINI.md](./GEMINI.md) - Additional project context

---

**Maintained by:** Claude Code
**Review Frequency:** Monthly or after major changes
