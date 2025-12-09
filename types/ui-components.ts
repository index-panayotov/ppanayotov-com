import * as React from "react";
// import { DayPicker } from "react-day-picker";
import { ComponentPropsWithoutRef } from 'react';
import type { Element } from 'hast';

// For Markdown Renderer
export type MarkdownComponentProps<T extends React.ElementType> = ComponentPropsWithoutRef<T> & {
  node?: Element;
};

// For Sidebar
export type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

// For Chart
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<string, string> }
  ); // Assuming THEMES keys are strings
};

export type ChartContextProps = {
  config: ChartConfig;
};

// For Calendar
// export type CalendarProps = React.ComponentProps<typeof DayPicker>;
export type CalendarProps = Record<string, unknown>;
