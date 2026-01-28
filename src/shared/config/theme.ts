export type ThemeMode = {
  background: string;
  foreground: string;
  border: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
};

export type ThemePalette = {
  light: ThemeMode;
  dark: ThemeMode;
};

export const themeVariantNames = ["default", "red", "purple", "blue"] as const;

export type ThemeVariantName = (typeof themeVariantNames)[number];

export type ThemeConfig = {
  radius: string;
  palettes: Record<ThemeVariantName, ThemePalette>;
};

export const themeConfig: ThemeConfig = {
  radius: "0.5rem",
  palettes: {
    default: {
      light: {
        background: "0 0% 100%",
        foreground: "222.2 84% 4.9%",
        border: "214.3 31.8% 91.4%",
        card: "0 0% 100%",
        cardForeground: "222.2 84% 4.9%",
        muted: "210 40% 96.1%",
        mutedForeground: "215.4 16.3% 46.9%",
        primary: "222.2 47.4% 11.2%",
        primaryForeground: "210 40% 98%",
        secondary: "210 40% 96.1%",
        secondaryForeground: "222.2 47.4% 11.2%",
        accent: "221.2 83.2% 53.3%",
        accentForeground: "210 40% 98%",
      },
      dark: {
        background: "222.2 84% 4.9%",
        foreground: "210 40% 98%",
        border: "217.2 32.6% 17.5%",
        card: "217.2 32.6% 17.5%",
        cardForeground: "210 40% 98%",
        muted: "217.2 32.6% 17.5%",
        mutedForeground: "215 20.2% 65.1%",
        primary: "210 40% 98%",
        primaryForeground: "222.2 47.4% 11.2%",
        secondary: "217.2 32.6% 17.5%",
        secondaryForeground: "210 40% 98%",
        accent: "217.2 91.2% 59.8%",
        accentForeground: "210 40% 98%",
      },
    },
    red: {
      light: {
        background: "0 70% 98%",
        foreground: "356 62% 18%",
        border: "0 43% 88%",
        card: "0 0% 100%",
        cardForeground: "356 62% 18%",
        muted: "5 35% 94%",
        mutedForeground: "356 35% 40%",
        primary: "356 70% 45%",
        primaryForeground: "0 0% 100%",
        secondary: "12 63% 96%",
        secondaryForeground: "356 65% 30%",
        accent: "358 72% 48%",
        accentForeground: "0 0% 100%",
      },
      dark: {
        background: "350 30% 12%",
        foreground: "0 0% 98%",
        border: "352 35% 30%",
        card: "352 32% 18%",
        cardForeground: "0 0% 98%",
        muted: "350 25% 25%",
        mutedForeground: "0 0% 90%",
        primary: "0 78% 62%",
        primaryForeground: "210 40% 8%",
        secondary: "350 32% 20%",
        secondaryForeground: "0 0% 98%",
        accent: "358 70% 58%",
        accentForeground: "0 0% 100%",
      },
    },
    purple: {
      light: {
        background: "270 60% 97%",
        foreground: "262 60% 20%",
        border: "270 35% 88%",
        card: "0 0% 100%",
        cardForeground: "262 60% 20%",
        muted: "274 40% 96%",
        mutedForeground: "262 35% 45%",
        primary: "262 72% 52%",
        primaryForeground: "0 0% 100%",
        secondary: "266 42% 95%",
        secondaryForeground: "262 55% 30%",
        accent: "265 80% 64%",
        accentForeground: "0 0% 100%",
      },
      dark: {
        background: "260 32% 14%",
        foreground: "0 0% 98%",
        border: "263 32% 28%",
        card: "262 30% 20%",
        cardForeground: "0 0% 98%",
        muted: "260 25% 24%",
        mutedForeground: "255 30% 75%",
        primary: "265 80% 72%",
        primaryForeground: "261 73% 15%",
        secondary: "261 36% 25%",
        secondaryForeground: "0 0% 100%",
        accent: "266 75% 68%",
        accentForeground: "263 80% 14%",
      },
    },
    blue: {
      light: {
        background: "214 70% 97%",
        foreground: "218 48% 18%",
        border: "215 33% 88%",
        card: "0 0% 100%",
        cardForeground: "218 48% 18%",
        muted: "213 37% 95%",
        mutedForeground: "217 32% 46%",
        primary: "213 90% 40%",
        primaryForeground: "210 40% 98%",
        secondary: "214 82% 96%",
        secondaryForeground: "217 65% 32%",
        accent: "205 100% 45%",
        accentForeground: "210 40% 98%",
      },
      dark: {
        background: "218 28% 13%",
        foreground: "0 0% 98%",
        border: "219 36% 26%",
        card: "219 30% 19%",
        cardForeground: "0 0% 98%",
        muted: "218 20% 24%",
        mutedForeground: "219 32% 72%",
        primary: "213 94% 68%",
        primaryForeground: "217 68% 20%",
        secondary: "215 44% 24%",
        secondaryForeground: "0 0% 98%",
        accent: "205 90% 60%",
        accentForeground: "210 40% 98%",
      },
    },
  },
};

function getPalette(variant: ThemeVariantName): ThemePalette {
  return themeConfig.palettes[variant] ?? themeConfig.palettes.default;
}

export function createThemeCssVariables(variant: ThemeVariantName = "default") {
  const palette = getPalette(variant);
  return `
:root {
  --background: ${palette.light.background};
  --foreground: ${palette.light.foreground};
  --card: ${palette.light.card};
  --card-foreground: ${palette.light.cardForeground};
  --border: ${palette.light.border};
  --primary: ${palette.light.primary};
  --primary-foreground: ${palette.light.primaryForeground};
  --secondary: ${palette.light.secondary};
  --secondary-foreground: ${palette.light.secondaryForeground};
  --accent: ${palette.light.accent};
  --accent-foreground: ${palette.light.accentForeground};
  --muted: ${palette.light.muted};
  --muted-foreground: ${palette.light.mutedForeground};
  --radius: ${themeConfig.radius};
}

[data-theme='dark'] {
  --background: ${palette.dark.background};
  --foreground: ${palette.dark.foreground};
  --card: ${palette.dark.card};
  --card-foreground: ${palette.dark.cardForeground};
  --border: ${palette.dark.border};
  --primary: ${palette.dark.primary};
  --primary-foreground: ${palette.dark.primaryForeground};
  --secondary: ${palette.dark.secondary};
  --secondary-foreground: ${palette.dark.secondaryForeground};
  --accent: ${palette.dark.accent};
  --accent-foreground: ${palette.dark.accentForeground};
  --muted: ${palette.dark.muted};
  --muted-foreground: ${palette.dark.mutedForeground};
}
`;
}
