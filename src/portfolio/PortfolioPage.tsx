import { localeContent, localeDirection } from "../content/content.utils";
import { usePortfolioContent } from "../hooks/usePortfolioContent";
import { themeStyle } from "../theme/theme";
import { PageMetadata } from "./PageMetadata";
import { PortfolioRenderer } from "./PortfolioRenderer";
import { FooterSection } from "./sections/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";

export function PortfolioPage() {
  const { content, activeLocale, setActiveLocale } = usePortfolioContent();
  const locale = content.settings.locales.find((item) => item.code === activeLocale) ?? content.settings.locales[0]!;
  const localized = localeContent(content, locale.code);
  const direction = localeDirection(locale.code);

  return (
    <div id="top" dir={direction} lang={locale.code} style={themeStyle(content.settings.theme.colors)} className="portfolio-theme min-h-screen">
      <PageMetadata seo={localized.seo} locale={locale.code} direction={direction} favicon={content.media.favicon} heroImage={content.media.heroImage} themeColor={content.settings.theme.colors.background} />
      {content.layout.header.visible ? <HeaderSection content={localized.header} locales={content.settings.locales} activeLocale={locale.code} onLocaleChange={setActiveLocale} /> : null}
      <PortfolioRenderer content={content} locale={locale.code} />
      {content.layout.footer.visible ? <FooterSection content={localized.footer} /> : null}
    </div>
  );
}
