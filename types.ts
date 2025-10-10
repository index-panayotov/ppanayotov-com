export interface ExperienceEntry {
  title: string;
  company: string;
  dateRange: string;
  location?: string;
  description: string;
  tags: string[];
  _index?: number; // Used for editing in the admin panel
}
