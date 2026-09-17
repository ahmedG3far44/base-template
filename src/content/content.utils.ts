import type { Direction, LocaleContent, PortfolioContent } from "./content.types";

export function localeDirection(code: string): Direction {
  return /^ar(?:-|$)/i.test(code.trim()) ? "rtl" : "ltr";
}

export function cloneContent(content: PortfolioContent): PortfolioContent {
  return structuredClone(content);
}

export function localeContent(content: PortfolioContent, locale: string): LocaleContent {
  return content.translations[locale] ?? content.translations[content.settings.defaultLocale] ?? Object.values(content.translations)[0]!;
}

export function localizedItem<T>(
  translations: Record<string, T>,
  locale: string,
  defaultLocale: string,
): T {
  return translations[locale] ?? translations[defaultLocale] ?? Object.values(translations)[0]!;
}

export function splitList(value: string): string[] {
  return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
}

export function joinList(value: string[]): string {
  return value.join("\n");
}

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
