"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { adminColorsDark } from './design-system';

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: "light" | "dark";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  actualTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function AdminThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "admin-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const getSystemTheme = () => {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const applyTheme = (newTheme: Theme) => {
      let resolvedTheme: "light" | "dark";
      
      if (newTheme === "system") {
        resolvedTheme = getSystemTheme();
      } else {
        resolvedTheme = newTheme;
      }

      setActualTheme(resolvedTheme);
      
      // Apply Tailwind dark mode class
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
      
      // Set CSS variables for admin theme (enhanced for UI components)
      if (resolvedTheme === "dark") {
        // Monokai admin specific variables
        root.style.setProperty("--admin-bg", adminColorsDark.background.primary);
        root.style.setProperty("--admin-card-bg", adminColorsDark.background.secondary);
        root.style.setProperty("--admin-border", adminColorsDark.background.focus);
        root.style.setProperty("--admin-text", adminColorsDark.text.primary);
        root.style.setProperty("--admin-text-muted", adminColorsDark.text.muted);
        root.style.setProperty("--admin-sidebar-bg", adminColorsDark.background.primary);
        
        // Override UI component variables for Monokai dark mode
        // Convert hex to RGB for CSS variables
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
          return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : "";
        };
        
        root.style.setProperty("--background", hexToRgb(adminColorsDark.background.primary));
        root.style.setProperty("--foreground", hexToRgb(adminColorsDark.text.primary));
        root.style.setProperty("--card", hexToRgb(adminColorsDark.background.secondary));
        root.style.setProperty("--card-foreground", hexToRgb(adminColorsDark.text.primary));
        root.style.setProperty("--popover", hexToRgb(adminColorsDark.background.secondary));
        root.style.setProperty("--popover-foreground", hexToRgb(adminColorsDark.text.primary));
        root.style.setProperty("--border", hexToRgb(adminColorsDark.background.focus));
        root.style.setProperty("--input", hexToRgb(adminColorsDark.background.focus));
        root.style.setProperty("--muted", hexToRgb(adminColorsDark.background.elevated));
        root.style.setProperty("--muted-foreground", hexToRgb(adminColorsDark.text.muted));
        root.style.setProperty("--accent", hexToRgb(adminColorsDark.background.elevated));
        root.style.setProperty("--accent-foreground", hexToRgb(adminColorsDark.text.primary));
        root.style.setProperty("--primary", hexToRgb(adminColorsDark.semantic.primary));
        root.style.setProperty("--primary-foreground", hexToRgb(adminColorsDark.text.primary));
        
        // Add semantic color custom properties for button styling
        root.style.setProperty("--admin-primary", adminColorsDark.semantic.primary);
        root.style.setProperty("--admin-success", adminColorsDark.semantic.success);
        root.style.setProperty("--admin-warning", adminColorsDark.semantic.warning);
        root.style.setProperty("--admin-error", adminColorsDark.semantic.error);
        root.style.setProperty("--admin-info", adminColorsDark.semantic.info);
      } else {
        // Admin specific variables for light mode
        root.style.setProperty("--admin-bg", "rgb(248 250 252)"); // slate-50
        root.style.setProperty("--admin-card-bg", "rgb(255 255 255)"); // white
        root.style.setProperty("--admin-border", "rgb(226 232 240)"); // slate-200
        root.style.setProperty("--admin-text", "rgb(15 23 42)"); // slate-900
        root.style.setProperty("--admin-text-muted", "rgb(100 116 139)"); // slate-500
        root.style.setProperty("--admin-sidebar-bg", "rgb(30 41 59)"); // slate-800
        
        // Reset UI component variables to light mode defaults
        root.style.setProperty("--background", "0 0% 100%"); // white
        root.style.setProperty("--foreground", "0 0% 3.9%"); // near black
        root.style.setProperty("--card", "0 0% 100%"); // white
        root.style.setProperty("--card-foreground", "0 0% 3.9%"); // near black
        root.style.setProperty("--popover", "0 0% 100%"); // white
        root.style.setProperty("--popover-foreground", "0 0% 3.9%"); // near black
        root.style.setProperty("--border", "214 32% 91%"); // slate-200
        root.style.setProperty("--input", "214 32% 91%"); // slate-200
        root.style.setProperty("--muted", "210 40% 96%"); // slate-100
        root.style.setProperty("--muted-foreground", "215 16% 47%"); // slate-500
        root.style.setProperty("--accent", "210 40% 96%"); // slate-100
        root.style.setProperty("--accent-foreground", "220 70% 30%"); // slate-700
      }
    };

    applyTheme(theme);

    // Listen for system theme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme(theme);
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    actualTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useAdminTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useAdminTheme must be used within a AdminThemeProvider");

  return context;
};