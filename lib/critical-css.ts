/**
 * Critical CSS Optimization Utilities
 *
 * This module provides tools for extracting and optimizing critical CSS for better page load performance.
 * Critical CSS includes styles needed for above-the-fold content to eliminate render-blocking CSS.
 */

export interface CriticalCSSOptions {
  width?: number;
  height?: number;
  penthouse?: {
    timeout?: number;
    forceInclude?: string[];
    blockJSRequests?: boolean;
  };
}

/**
 * Critical CSS rules that should always be included for above-the-fold content
 * These styles are essential for the initial page render
 */
export const CRITICAL_CSS_SELECTORS = [
  // Layout and structure
  'html', 'body',
  '.min-h-screen', '.bg-gradient-to-br',

  // Header and navigation
  'header', 'nav', '.container', '.mx-auto',
  '.cv-nav-link', '.cv-button-primary', '.cv-button-secondary',

  // Hero section (above the fold)
  '#hero', '.cv-hero-gradient',
  '.text-4xl', '.lg\\:text-5xl', '.font-bold', '.text-white',
  '.text-xl', '.lg\\:text-2xl', '.text-blue-100',
  '.text-blue-50', '.text-blue-50\\/90',

  // Profile image
  '.w-48', '.h-48', '.lg\\:w-56', '.lg\\:h-56',
  '.rounded-2xl', '.overflow-hidden', '.shadow-2xl',
  '.border-4', '.border-white\\/20',

  // Critical typography
  'h1', 'h2', 'h3', 'p',
  '.text-3xl', '.text-2xl', '.text-xl', '.text-lg',
  '.font-bold', '.font-semibold', '.font-medium',

  // Essential utilities
  '.flex', '.grid', '.block', '.inline', '.hidden',
  '.relative', '.absolute', '.fixed',
  '.w-full', '.h-full', '.max-w-4xl',
  '.px-4', '.py-6', '.p-4', '.p-6',
  '.mt-4', '.mb-4', '.mr-2', '.ml-2',
  '.space-x-2', '.space-y-2', '.gap-2', '.gap-4',

  // Animation and transitions (critical for perceived performance)
  '.transition-all', '.duration-200', '.duration-300',
  '@keyframes fadeInUp', '.cv-section', '.cv-card',

  // Mobile optimizations
  '.md\\:flex', '.md\\:hidden', '.lg\\:flex-row',
  '.sm\\:flex-row', '.sm\\:justify-between',

  // Responsive utilities
  '.container', '.mx-auto', '.px-4',
] as const;

/**
 * CSS properties that are critical for initial render
 */
export const CRITICAL_CSS_PROPERTIES = [
  'display', 'position', 'top', 'left', 'right', 'bottom',
  'width', 'height', 'max-width', 'max-height', 'min-width', 'min-height',
  'margin', 'padding', 'border', 'background', 'color',
  'font-family', 'font-size', 'font-weight', 'line-height',
  'text-align', 'vertical-align', 'visibility', 'opacity',
  'z-index', 'overflow', 'transform', 'transition',
  'flex', 'grid', 'justify-content', 'align-items',
  'grid-template-columns', 'grid-template-rows',
] as const;

/**
 * Generate critical CSS rules for the CV homepage
 * This extracts the most important styles for above-the-fold content
 */
export function generateCriticalCSS(): string {
  return `
    /* Critical CSS for CV Homepage - Above the fold content */

    /* Reset and base styles */
    *, *::before, *::after {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
      border-color: theme('borderColor.DEFAULT', currentColor);
    }

    html {
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      -moz-tab-size: 4;
      tab-size: 4;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-feature-settings: normal;
      font-variation-settings: normal;
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
    }

    body {
      margin: 0;
      line-height: inherit;
      font-display: swap;
      font-feature-settings: "kern" 1, "liga" 1, "clig" 1, "calt" 1;
      font-variant-ligatures: common-ligatures contextual;
      text-size-adjust: 100%;
    }

    /* Critical layout */
    .min-h-screen { min-height: 100vh; }
    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
    .from-slate-50 { --tw-gradient-from: #f8fafc; --tw-gradient-to: rgb(248 250 252 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
    .to-slate-100\\/50 { --tw-gradient-to: rgb(241 245 249 / 0.5); }

    /* Container */
    .container { width: 100%; margin-left: auto; margin-right: auto; }
    @media (min-width: 640px) { .container { max-width: 640px; } }
    @media (min-width: 768px) { .container { max-width: 768px; } }
    @media (min-width: 1024px) { .container { max-width: 1024px; } }
    @media (min-width: 1280px) { .container { max-width: 1280px; } }

    /* Header styles */
    header { display: block; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }

    /* Navigation */
    nav { display: block; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .space-x-2 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.5rem; }
    .space-x-8 > :not([hidden]) ~ :not([hidden]) { margin-left: 2rem; }

    /* Typography */
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .font-bold { font-weight: 700; }
    .text-slate-800 { color: rgb(30 41 59); }

    /* Hero section */
    #hero {
      position: relative;
      padding-top: 5rem;
      padding-bottom: 5rem;
      overflow: hidden;
    }

    .cv-hero-gradient {
      background: linear-gradient(135deg, hsl(220, 30%, 25%), hsl(220, 35%, 35%));
    }

    .absolute { position: absolute; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .relative { position: relative; }

    /* Hero content */
    .max-w-4xl { max-width: 56rem; }
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-white { color: rgb(255 255 255); }
    .mb-4 { margin-bottom: 1rem; }
    .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    .text-blue-100 { color: rgb(219 234 254); }
    .mb-6 { margin-bottom: 1.5rem; }
    .text-blue-50 { color: rgb(239 246 255); }
    .mb-2 { margin-bottom: 0.5rem; }

    /* Profile image */
    .w-48 { width: 12rem; }
    .h-48 { height: 12rem; }
    .rounded-2xl { border-radius: 1rem; }
    .overflow-hidden { overflow: hidden; }
    .shadow-2xl { box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); }
    .border-4 { border-width: 4px; }
    .object-cover { object-fit: cover; }
    .w-full { width: 100%; }
    .h-full { height: 100%; }

    /* Responsive design */
    @media (min-width: 1024px) {
      .lg\\:flex-row { flex-direction: row; }
      .lg\\:text-left { text-align: left; }
      .lg\\:text-5xl { font-size: 3rem; line-height: 1; }
      .lg\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
      .lg\\:w-56 { width: 14rem; }
      .lg\\:h-56 { height: 14rem; }
      .lg\\:justify-start { justify-content: flex-start; }
    }

    /* Hidden utilities */
    .hidden { display: none; }
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }

    /* Animations (critical for perceived performance) */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .cv-section {
      animation: fadeInUp 0.6s ease-out;
    }

    /* Focus and accessibility */
    .focus\\:not-sr-only:focus { position: static; width: auto; height: auto; padding: inherit; margin: inherit; overflow: visible; clip: auto; white-space: normal; }

    /* Print critical styles */
    @media print {
      .print\\:hidden { display: none !important; }
      .print\\:block { display: block !important; }
    }
  `;
}

/**
 * Create a non-blocking CSS loading function
 * This loads non-critical CSS asynchronously after the critical path
 */
export function createAsyncCSSLoader(): string {
  return `
    (function() {
      // Load non-critical CSS asynchronously
      function loadCSS(href, media, onload) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = media || 'all';
        if (onload) link.onload = onload;
        document.head.appendChild(link);
      }

      // Load non-critical styles after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          loadCSS('/_next/static/css/non-critical.css', 'all');
        });
      } else {
        loadCSS('/_next/static/css/non-critical.css', 'all');
      }
    })();
  `;
}

/**
 * Optimize CSS delivery by identifying critical and non-critical selectors
 */
export function optimizeCSSDelivery(cssContent: string): {
  critical: string;
  nonCritical: string;
} {
  const criticalRules: string[] = [];
  const nonCriticalRules: string[] = [];

  // Split CSS into rules (simplified - in production, use a proper CSS parser)
  const rules = cssContent.split('}').filter(rule => rule.trim());

  rules.forEach(rule => {
    const selector = rule.split('{')[0]?.trim();

    if (selector && CRITICAL_CSS_SELECTORS.some(criticalSelector =>
      selector.includes(criticalSelector) ||
      selector.startsWith(criticalSelector) ||
      selector.includes('hero') ||
      selector.includes('header') ||
      selector.includes('nav')
    )) {
      criticalRules.push(rule + '}');
    } else {
      nonCriticalRules.push(rule + '}');
    }
  });

  return {
    critical: criticalRules.join('\n'),
    nonCritical: nonCriticalRules.join('\n')
  };
}

/**
 * Get critical CSS dimensions for different viewports
 */
export const CRITICAL_VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
  large: { width: 1920, height: 1080 }
} as const;

/**
 * Performance timing for CSS loading
 */
export function measureCSSPerformance() {
  if (typeof window === 'undefined') return null;

  return {
    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
    firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
  };
}

export default {
  generateCriticalCSS,
  createAsyncCSSLoader,
  optimizeCSSDelivery,
  measureCSSPerformance,
  CRITICAL_CSS_SELECTORS,
  CRITICAL_VIEWPORTS
};