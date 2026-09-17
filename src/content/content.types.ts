export const sectionIds = [
  "hero",
  "experiences",
  "skills",
  "projects",
  "services",
  "testimonials",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];
export type Direction = "ltr" | "rtl";

export const themePresetIds = ["minimal", "warm", "midnight", "custom"] as const;
export type ThemePresetId = (typeof themePresetIds)[number];

export interface ThemeColors {
  background: string;
  heading: string;
  primaryText: string;
  secondaryText: string;
  border: string;
  cardBackground: string;
  cardText: string;
  accent: string;
  accentText: string;
}

export interface ThemeSettings {
  preset: ThemePresetId;
  colors: ThemeColors;
}

export interface LocaleDefinition {
  code: string;
  name: string;
}

export interface LinkItem {
  id: string;
  label: string;
  href: string;
}

export interface CTA {
  label: string;
  href: string;
}

export interface HeaderContent {
  name: string;
  logoText: string;
  navigation: LinkItem[];
  cta?: CTA;
  socialLinks: LinkItem[];
  showLanguageSwitcher: boolean;
}

export interface HeroContent {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  primaryCTA?: CTA;
  secondaryCTA?: CTA;
  availability?: string;
  location?: string;
}

export interface ContactContent {
  heading: string;
  description?: string;
  email?: string;
  phone?: string;
  location?: string;
  cta?: CTA;
  contactLinks: LinkItem[];
  socialLinks: LinkItem[];
}

export interface FooterContent {
  name: string;
  description?: string;
  navigation: LinkItem[];
  socialLinks: LinkItem[];
  additionalLinks: LinkItem[];
  copyright: string;
}

export interface SEOContent {
  pageTitle: string;
  description: string;
  keywords: string[];
  author?: string;
  socialTitle?: string;
  socialDescription?: string;
}

export interface LocaleContent {
  seo: SEOContent;
  header: HeaderContent;
  hero: HeroContent;
  contact: ContactContent;
  footer: FooterContent;
  sectionHeadings: {
    experiences: string;
    skills: string;
    projects: string;
    services: string;
    testimonials: string;
  };
  labels: {
    present: string;
    skill: string;
    liveSite: string;
    repository: string;
    caseStudy: string;
    imagePlaceholder: string;
    viewDetails: string;
    close: string;
    projectDetails: string;
    category: string;
    technologies: string;
    role: string;
    year: string;
    gallery: string;
  };
}

export interface ExperienceTranslation {
  company: string;
  role: string;
  employmentType?: string;
  location?: string;
  description?: string;
  achievements: string[];
  technologies: string[];
}

export interface Experience {
  id: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  translations: Record<string, ExperienceTranslation>;
}

export interface SkillTranslation {
  name: string;
  category?: string;
}

export interface Skill {
  id: string;
  icon?: string;
  translations: Record<string, SkillTranslation>;
}

export interface ProjectTranslation {
  title: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  role?: string;
  year?: string;
  technologies: string[];
}

export interface Project {
  id: string;
  image?: string;
  gallery: string[];
  liveUrl?: string;
  repositoryUrl?: string;
  caseStudyUrl?: string;
  featured: boolean;
  translations: Record<string, ProjectTranslation>;
}

export interface ServiceTranslation {
  title: string;
  description?: string;
  features: string[];
  cta?: CTA;
}

export interface Service {
  id: string;
  translations: Record<string, ServiceTranslation>;
}

export interface TestimonialTranslation {
  quote: string;
  name: string;
  role?: string;
  company?: string;
}

export interface Testimonial {
  id: string;
  avatar?: string;
  translations: Record<string, TestimonialTranslation>;
}

export interface PortfolioContent {
  version: 1;
  settings: {
    defaultLocale: string;
    locales: LocaleDefinition[];
    theme: ThemeSettings;
  };
  layout: {
    header: { visible: boolean };
    sections: Array<{ id: SectionId; visible: boolean }>;
    skills: { showCategory: boolean };
    footer: { visible: boolean };
  };
  media: {
    heroImage?: string;
    favicon?: string;
    imageRadii: Record<string, number>;
  };
  translations: Record<string, LocaleContent>;
  collections: {
    experiences: Experience[];
    skills: Skill[];
    projects: Project[];
    services: Service[];
    testimonials: Testimonial[];
  };
}

export type CollectionKey = keyof PortfolioContent["collections"];
