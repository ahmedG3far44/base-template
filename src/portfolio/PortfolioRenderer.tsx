import type { PortfolioContent, SectionId } from "../content/content.types";
import { localeDirection, localizedItem } from "../content/content.utils";
import { ContactSection } from "./sections/ContactSection";
import { ExperiencesSection } from "./sections/ExperiencesSection";
import { HeroSection } from "./sections/HeroSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ServicesSection } from "./sections/ServicesSection";
import { SkillsSection } from "./sections/SkillsSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";

export function PortfolioRenderer({ content, locale }: { content: PortfolioContent; locale: string }) {
  const fallback = content.settings.defaultLocale;
  const localized = content.translations[locale] ?? content.translations[fallback] ?? Object.values(content.translations)[0]!;
  const radiusFor = (path: string | undefined, defaultRadius: number) => path ? content.media.imageRadii[path] ?? defaultRadius : defaultRadius;
  const components: Record<SectionId, () => React.ReactNode> = {
    hero: () => <HeroSection content={localized.hero} image={content.media.heroImage} imagePlaceholder={localized.labels.imagePlaceholder} imageRadius={radiusFor(content.media.heroImage, 16)} />,
    experiences: () => <ExperiencesSection heading={localized.sectionHeadings.experiences} presentLabel={localized.labels.present} items={content.collections.experiences.map((entity) => ({ entity, content: localizedItem(entity.translations, locale, fallback) }))} />,
    skills: () => <SkillsSection heading={localized.sectionHeadings.skills} fallbackCategory={localized.labels.skill} showCategory={content.layout.skills.showCategory} items={content.collections.skills.map((entity) => ({ entity, content: localizedItem(entity.translations, locale, fallback), imageRadius: radiusFor(entity.icon, 8) }))} />,
    projects: () => <ProjectsSection heading={localized.sectionHeadings.projects} labels={localized.labels} direction={localeDirection(locale)} language={locale} themeColors={content.settings.theme.colors} imageRadii={content.media.imageRadii} items={content.collections.projects.map((entity) => ({ entity, content: localizedItem(entity.translations, locale, fallback) }))} />,
    services: () => <ServicesSection heading={localized.sectionHeadings.services} items={content.collections.services.map((entity) => ({ entity, content: localizedItem(entity.translations, locale, fallback) }))} />,
    testimonials: () => <TestimonialsSection heading={localized.sectionHeadings.testimonials} items={content.collections.testimonials.map((entity) => ({ entity, content: localizedItem(entity.translations, locale, fallback), imageRadius: radiusFor(entity.avatar, 24) }))} />,
    contact: () => <ContactSection content={localized.contact} />,
  };

  return <main>{content.layout.sections.filter((section) => section.visible).map((section) => <div key={section.id}>{components[section.id]()}</div>)}</main>;
}
