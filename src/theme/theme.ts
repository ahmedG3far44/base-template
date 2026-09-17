import type { CSSProperties } from "react";
import type { ThemeColors, ThemePresetId } from "../content/content.types";

export interface ThemePreset {
  id: Exclude<ThemePresetId, "custom">;
  name: string;
  description: string;
  colors: ThemeColors;
}

export const themePresets: ThemePreset[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Crisp white and neutral ink.",
    colors: {
      background: "#FFFFFF",
      heading: "#111827",
      primaryText: "#374151",
      secondaryText: "#4B5563",
      border: "#D1D5DB",
      cardBackground: "#FFFFFF",
      cardText: "#111827",
      accent: "#111827",
      accentText: "#FFFFFF",
    },
  },
  {
    id: "warm",
    name: "Warm Paper",
    description: "Soft canvas with an earthy accent.",
    colors: {
      background: "#F6F1E8",
      heading: "#2F2923",
      primaryText: "#4B433C",
      secondaryText: "#6B5D52",
      border: "#C9BDAE",
      cardBackground: "#FFFDF8",
      cardText: "#302A24",
      accent: "#9A3412",
      accentText: "#FFFFFF",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep navy with a bright blue accent.",
    colors: {
      background: "#0B1120",
      heading: "#F8FAFC",
      primaryText: "#CBD5E1",
      secondaryText: "#94A3B8",
      border: "#334155",
      cardBackground: "#111827",
      cardText: "#F1F5F9",
      accent: "#38BDF8",
      accentText: "#082F49",
    },
  },
];

export function themeStyle(colors: ThemeColors): CSSProperties {
  return {
    "--theme-background": colors.background,
    "--theme-heading": colors.heading,
    "--theme-primary-text": colors.primaryText,
    "--theme-secondary-text": colors.secondaryText,
    "--theme-border": colors.border,
    "--theme-card-background": colors.cardBackground,
    "--theme-card-text": colors.cardText,
    "--theme-accent": colors.accent,
    "--theme-accent-text": colors.accentText,
  } as CSSProperties;
}

function channelToLinear(channel: number) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  const value = hex.slice(1);
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return 0.2126 * channelToLinear(red) + 0.7152 * channelToLinear(green) + 0.0722 * channelToLinear(blue);
}

export function contrastRatio(foreground: string, background: string) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}
