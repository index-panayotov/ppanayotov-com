export interface ExperienceEntry {
  title: string;
  company: string;
  dateRange: string;
  location?: string;
  description: string;
  tags: string[];
}

export interface OpenRouterOptions {
  systemInput: string;
  data: string;
  creativity?: number; // 0 = deterministic, 1 = max creativity
  signal?: AbortSignal; // For request timeout handling
  customModel?: string; // Optional model override
}
