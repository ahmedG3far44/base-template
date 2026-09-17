import type { HeaderContent, LocaleDefinition } from "../../content/content.types";

export function HeaderSection({ content, locales, activeLocale, onLocaleChange }: {
  content: HeaderContent;
  locales: LocaleDefinition[];
  activeLocale: string;
  onLocaleChange: (locale: string) => void;
}) {
  return (
    <header className="border-b border-gray-200 px-6 py-4 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <a href="#top" className="font-semibold text-gray-950" aria-label={content.name}>{content.logoText}</a>
        <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
          {content.navigation.map((item) => <a key={item.id} href={item.href} className="hover:text-black">{item.label}</a>)}
          {content.socialLinks.map((item) => <a key={item.id} href={item.href} className="hover:text-black">{item.label}</a>)}
          {content.showLanguageSwitcher && locales.length > 1 ? (
            <label className="sr-only" htmlFor="portfolio-locale">Language</label>
          ) : null}
          {content.showLanguageSwitcher && locales.length > 1 ? (
            <select id="portfolio-locale" value={activeLocale} onChange={(event) => onLocaleChange(event.target.value)} className="border border-gray-300 bg-white px-2 py-1">
              {locales.map((locale) => <option key={locale.code} value={locale.code}>{locale.name}</option>)}
            </select>
          ) : null}
          {content.cta ? <a href={content.cta.href} className="portfolio-action border px-3 py-2 font-medium">{content.cta.label}</a> : null}
        </nav>
      </div>
    </header>
  );
}
