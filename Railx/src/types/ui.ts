export type Theme = 'light' | 'dark';

export const Themes = ["light", "dark"] as const;

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}