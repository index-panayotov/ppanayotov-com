/**
 * Admin Design System
 * Centralized design tokens and utility classes for the admin panel
 */


// Light theme colors for optimal admin dashboard experience
export const adminColors = {
  // Clean backgrounds
  background: {
    primary: '#f8f9fa',    // Clean, spacious interface
    secondary: '#ffffff',  // Pure white for content cards
    elevated: '#e9ecef',   // Subtle gray for elevated elements
    focus: '#3b86d1',      // Calming blue for focus states
  },
  
  // Professional text colors
  text: {
    primary: '#000000',    // True black for maximum readability
    secondary: '#6c757d',  // Medium gray for secondary content
    muted: '#adb5bd',      // Light gray for muted content
    inverse: '#ffffff',    // White text on dark backgrounds
  },
  
  // Professional semantic colors
  semantic: {
    success: '#21bf06',    // Professional green for positive metrics
    warning: '#f8f9fa',    // Light gray, closer to white
    error: '#64748b',      // Professional slate for errors
    info: '#0dcaf0',       // Cyan for informational content
    primary: '#3b86d1',    // Calming blue for navigation
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

// Common CSS class combinations - Light theme only
export const adminClassNames = {
  // Card variants - Clean light theme
  card: {
    // Use `bg-card` and `border-border` so card colors follow the global CSS variables
    base: 'bg-card border border-border rounded-lg',
    elevated: 'bg-card border border-border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200',
    interactive: 'bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer',
  },
  
  // Text variants - Professional readability
  text: {
    heading: 'text-gray-900 font-bold',
    subheading: 'text-gray-900 font-semibold', 
    body: 'text-gray-800',
    muted: 'text-gray-600',
    caption: 'text-gray-500 text-sm',
  },
  
  // Button variants - Clean professional styling
  button: {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl',
    secondary: 'border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200',
    ghost: 'hover:bg-gray-100 text-gray-700 rounded-lg transition-all duration-200',
    danger: 'bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-lg transition-all duration-200',
    success: 'bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200',
  },
  
  // Icon button variants - Light theme optimized
  iconButton: {
    base: 'h-8 w-8 p-0 rounded-lg transition-all duration-200',
    ghost: 'h-8 w-8 p-0 hover:bg-gray-100 rounded-lg transition-all duration-200',
    primary: 'h-8 w-8 p-0 hover:bg-blue-50 text-blue-600 rounded-lg transition-all duration-200',
    danger: 'h-8 w-8 p-0 hover:bg-slate-50 text-slate-600 rounded-lg transition-all duration-200',
  },
  
  // Layout utilities
  layout: {
    pageContainer: 'p-6 space-y-6',
    sectionSpacing: 'space-y-6',
    cardGrid: 'grid gap-6',
    flexBetween: 'flex items-center justify-between',
    flexCenter: 'flex items-center justify-center',
  },
  
  // Page header patterns - Clean light theme
  pageHeader: {
    container: 'bg-card rounded-lg border border-border p-6',
    layout: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
    titleSection: 'space-y-1',
    actionsSection: 'flex gap-2',
  },
  
  // Form elements - Optimized for readability
  form: {
    input: 'h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg',
    label: 'text-sm font-medium text-gray-700',
    helpText: 'text-sm text-gray-600',
  },
  
  // Empty states - Clean and welcoming
  emptyState: {
    container: 'text-center py-12 bg-card rounded-lg border border-border',
    icon: 'mx-auto h-12 w-12 text-gray-400 mb-4',
    title: 'text-lg font-medium text-gray-900 mb-2',
    description: 'text-gray-600 max-w-sm mx-auto',
  },
  
  // Badge variants - Light theme semantic colors
  badge: {
    primary: 'bg-blue-50 text-blue-700 border border-blue-200',
    secondary: 'bg-gray-50 text-gray-700 border border-gray-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-gray-50 text-gray-700 border border-gray-200',
    danger: 'bg-slate-50 text-slate-700 border border-slate-200',
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