/**
 * Admin Design System
 * Centralized design tokens and utility classes for the admin panel
 */

// Color palette for admin panel
export const adminColors = {
  // Primary blues
  primary: {
    50: 'rgb(239 246 255)',   // blue-50
    100: 'rgb(219 234 254)',  // blue-100
    500: 'rgb(59 130 246)',   // blue-500
    600: 'rgb(37 99 235)',    // blue-600
    700: 'rgb(29 78 216)',    // blue-700
    900: 'rgb(30 58 138)',    // blue-900
  },
  
  // Neutral grays/slates
  neutral: {
    50: 'rgb(248 250 252)',   // slate-50
    100: 'rgb(241 245 249)',  // slate-100
    200: 'rgb(226 232 240)',  // slate-200
    300: 'rgb(203 213 225)',  // slate-300
    400: 'rgb(148 163 184)',  // slate-400
    500: 'rgb(100 116 139)',  // slate-500
    600: 'rgb(71 85 105)',    // slate-600
    700: 'rgb(51 65 85)',     // slate-700
    800: 'rgb(30 41 59)',     // slate-800
    900: 'rgb(15 23 42)',     // slate-900
  },
  
  // Text colors
  text: {
    primary: 'rgb(15 23 42)',      // slate-900
    secondary: 'rgb(100 116 139)', // slate-500
    muted: 'rgb(148 163 184)',     // slate-400
    inverse: 'rgb(248 250 252)',   // slate-50
  },
  
  // Semantic colors
  success: {
    50: 'rgb(240 253 244)',   // green-50
    500: 'rgb(34 197 94)',    // green-500
    600: 'rgb(22 163 74)',    // green-600
  },
  
  warning: {
    50: 'rgb(254 252 232)',   // yellow-50
    500: 'rgb(234 179 8)',    // yellow-500
    600: 'rgb(202 138 4)',    // yellow-600
  },
  
  danger: {
    50: 'rgb(254 242 242)',   // red-50
    500: 'rgb(239 68 68)',    // red-500
    600: 'rgb(220 38 38)',    // red-600
  },
} as const;

// Dark mode variants - Monokai theme colors
export const adminColorsDark = {
  // Core Monokai backgrounds
  background: {
    primary: '#272822',    // Main dark background
    secondary: '#1e1f1c',  // Tab wells, borders
    elevated: '#414339',   // Selection, hover states
    focus: '#75715e',      // Focus, accent elements
  },
  
  // Monokai text colors
  text: {
    primary: '#f8f8f2',    // Main foreground text
    secondary: '#90908a',  // Secondary text
    muted: '#88846f',      // Comments, muted text
    inverse: '#272822',    // Dark text on light backgrounds
  },
  
  // Monokai semantic colors
  semantic: {
    success: '#A6E22E',    // Green - success, actions
    warning: '#E6DB74',    // Yellow - warnings, highlights
    error: '#F92672',      // Pink - errors, delete actions
    info: '#66D9EF',       // Blue - information, links
    primary: '#AE81FF',    // Purple - primary actions
    orange: '#FD971F',     // Orange - special highlights
  },
} as const;

// Spacing scale
export const adminSpacing = {
  xs: '0.5rem',    // 2
  sm: '0.75rem',   // 3
  md: '1rem',      // 4
  lg: '1.5rem',    // 6
  xl: '2rem',      // 8
  '2xl': '3rem',   // 12
  '3xl': '4rem',   // 16
} as const;

// Typography scale
export const adminTypography = {
  sizes: {
    xs: '0.75rem',    // text-xs
    sm: '0.875rem',   // text-sm
    base: '1rem',     // text-base
    lg: '1.125rem',   // text-lg
    xl: '1.25rem',    // text-xl
    '2xl': '1.5rem',  // text-2xl
    '3xl': '1.875rem', // text-3xl
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

// Border radius
export const adminBorderRadius = {
  sm: '0.125rem',   // rounded-sm
  base: '0.25rem',  // rounded
  md: '0.375rem',   // rounded-md
  lg: '0.5rem',     // rounded-lg
  xl: '0.75rem',    // rounded-xl
  '2xl': '1rem',    // rounded-2xl
  full: '9999px',   // rounded-full
} as const;

// Shadow scale
export const adminShadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const;

// Common CSS class combinations (updated for Monokai theme)
export const adminClassNames = {
  // Card variants - using CSS custom properties set by theme provider
  card: {
    base: 'bg-white dark:bg-[var(--admin-card-bg)] border border-slate-200 dark:border-[var(--admin-border)] rounded-lg',
    elevated: 'bg-white dark:bg-[var(--admin-card-bg)] border border-slate-200 dark:border-[var(--admin-border)] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200',
    interactive: 'bg-white dark:bg-[var(--admin-card-bg)] border border-slate-200 dark:border-[var(--admin-border)] rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer',
  },
  
  // Text variants - using Monokai text colors
  text: {
    heading: 'text-gray-900 dark:text-[var(--admin-text)] font-bold',
    subheading: 'text-gray-900 dark:text-[var(--admin-text)] font-semibold', 
    body: 'text-gray-700 dark:text-[var(--admin-text)]',
    muted: 'text-gray-600 dark:text-[var(--admin-text-muted)]',
    caption: 'text-gray-500 dark:text-[var(--admin-text-muted)] text-sm',
  },
  
  // Button variants - using Monokai semantic colors
  button: {
    primary: 'bg-blue-600 dark:bg-[color:var(--admin-primary)] hover:bg-blue-700 dark:hover:bg-[color:var(--admin-primary)]/80 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl',
    secondary: 'border border-slate-300 dark:border-[var(--admin-border)] hover:bg-slate-50 dark:hover:bg-[var(--admin-card-bg)] text-gray-700 dark:text-[var(--admin-text)] font-medium rounded-lg transition-all duration-200',
    ghost: 'hover:bg-slate-100 dark:hover:bg-[var(--admin-card-bg)] text-gray-700 dark:text-[var(--admin-text)] rounded-lg transition-all duration-200',
    danger: 'bg-red-600 dark:bg-[color:var(--admin-error)] hover:bg-red-700 dark:hover:bg-[color:var(--admin-error)]/80 text-white font-medium rounded-lg transition-all duration-200',
  },
  
  // Icon button variants - using Monokai colors
  iconButton: {
    base: 'h-8 w-8 p-0 rounded-lg transition-all duration-200',
    ghost: 'h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-[var(--admin-card-bg)] rounded-lg transition-all duration-200',
    primary: 'h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-[color:var(--admin-primary)]/20 text-blue-600 dark:text-[color:var(--admin-primary)] rounded-lg transition-all duration-200',
    danger: 'h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-[color:var(--admin-error)]/20 text-red-600 dark:text-[color:var(--admin-error)] rounded-lg transition-all duration-200',
  },
  
  // Layout utilities
  layout: {
    pageContainer: 'p-6 space-y-6',
    sectionSpacing: 'space-y-6',
    cardGrid: 'grid gap-6',
    flexBetween: 'flex items-center justify-between',
    flexCenter: 'flex items-center justify-center',
  },
  
  // Page header patterns - using Monokai theme
  pageHeader: {
    container: 'bg-white dark:bg-[var(--admin-card-bg)] rounded-lg border border-slate-200 dark:border-[var(--admin-border)] p-6',
    layout: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
    titleSection: 'space-y-1',
    actionsSection: 'flex gap-2',
  },
  
  // Form elements
  form: {
    input: 'h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg',
    label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
    helpText: 'text-sm text-gray-600 dark:text-gray-400',
  },
  
  // Empty states
  emptyState: {
    container: 'text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700',
    icon: 'mx-auto h-12 w-12 text-gray-400 mb-4',
    title: 'text-lg font-medium text-gray-900 dark:text-gray-100 mb-2',
    description: 'text-gray-600 dark:text-gray-400 max-w-sm mx-auto',
  },
  
  // Badge variants
  badge: {
    primary: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    secondary: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    danger: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  },
} as const;

// Animation utilities
export const adminAnimations = {
  transitions: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-200',
    slow: 'transition-all duration-300',
  },
  
  transforms: {
    scaleHover: 'hover:scale-105',
    slideIn: 'animate-in slide-in-from-left-5',
    fadeIn: 'animate-in fade-in-0',
  },
} as const;

// Responsive breakpoints
export const adminBreakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;