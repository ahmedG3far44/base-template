import { z } from "zod";
import { sectionIds, themePresetIds } from "./content.types.ts";

const nonEmpty = z.string().trim().min(1);
const optionalText = z.string().optional();
const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a six-digit hex color such as #111827");
const ctaSchema = z.object({ label: nonEmpty, href: nonEmpty });
const linkSchema = z.object({ id: nonEmpty, label: nonEmpty, href: nonEmpty });
const translatedRecord = <T extends z.ZodType>(value: T) =>
  z.record(z.string().min(1), value).refine((record) => Object.keys(record).length > 0, {
    message: "At least one translation is required",
  });

const localeContentSchema = z.object({
  seo: z.object({
    pageTitle: nonEmpty,
    description: nonEmpty,
    keywords: z.array(nonEmpty).min(1),
    author: optionalText,
    socialTitle: optionalText,
    socialDescription: optionalText,
  }),
  header: z.object({
    name: nonEmpty,
    logoText: nonEmpty,
    navigation: z.array(linkSchema),
    cta: ctaSchema.optional(),
    socialLinks: z.array(linkSchema),
    showLanguageSwitcher: z.boolean(),
  }),
  hero: z.object({
    eyebrow: optionalText,
    title: nonEmpty,
    subtitle: optionalText,
    description: optionalText,
    primaryCTA: ctaSchema.optional(),
    secondaryCTA: ctaSchema.optional(),
    availability: optionalText,
    location: optionalText,
  }),
  contact: z.object({
    heading: nonEmpty,
    description: optionalText,
    email: optionalText,
    phone: optionalText,
    location: optionalText,
    cta: ctaSchema.optional(),
    contactLinks: z.array(linkSchema),
    socialLinks: z.array(linkSchema),
  }),
  footer: z.object({
    name: nonEmpty,
    description: optionalText,
    navigation: z.array(linkSchema),
    socialLinks: z.array(linkSchema),
    additionalLinks: z.array(linkSchema),
    copyright: nonEmpty,
  }),
  sectionHeadings: z.object({
    experiences: nonEmpty,
    skills: nonEmpty,
    projects: nonEmpty,
    services: nonEmpty,
    testimonials: nonEmpty,
  }),
  labels: z.object({
    present: nonEmpty,
    skill: nonEmpty,
    liveSite: nonEmpty,
    repository: nonEmpty,
    caseStudy: nonEmpty,
    imagePlaceholder: nonEmpty,
    viewDetails: nonEmpty,
    close: nonEmpty,
    projectDetails: nonEmpty,
    category: nonEmpty,
    technologies: nonEmpty,
    role: nonEmpty,
    year: nonEmpty,
    gallery: nonEmpty,
  }),
});

export const portfolioContentSchema = z
  .object({
    version: z.literal(1),
    settings: z.object({
      defaultLocale: nonEmpty,
      locales: z
        .array(z.object({ code: nonEmpty, name: nonEmpty }))
        .min(1),
      theme: z.object({
        preset: z.enum(themePresetIds),
        colors: z.object({
          background: hexColor,
          heading: hexColor,
          primaryText: hexColor,
          secondaryText: hexColor,
          border: hexColor,
          cardBackground: hexColor,
          cardText: hexColor,
          accent: hexColor,
          accentText: hexColor,
        }),
      }),
    }),
    layout: z.object({
      header: z.object({ visible: z.boolean() }),
      sections: z.array(z.object({ id: z.enum(sectionIds), visible: z.boolean() })),
      skills: z.object({ showCategory: z.boolean() }),
      footer: z.object({ visible: z.boolean() }),
    }),
    media: z.object({
      heroImage: optionalText,
      favicon: optionalText,
      imageRadii: z.record(z.string().min(1), z.number().int().min(0).max(200)),
    }),
    translations: z.record(z.string().min(1), localeContentSchema),
    collections: z.object({
      experiences: z.array(
        z.object({
          id: nonEmpty,
          startDate: optionalText,
          endDate: optionalText,
          current: z.boolean(),
          translations: translatedRecord(
            z.object({
              company: nonEmpty,
              role: nonEmpty,
              employmentType: optionalText,
              location: optionalText,
              description: optionalText,
              achievements: z.array(z.string()),
              technologies: z.array(z.string()),
            }),
          ),
        }),
      ),
      skills: z.array(
        z.object({
          id: nonEmpty,
          icon: optionalText,
          translations: translatedRecord(
            z.object({ name: nonEmpty, category: optionalText }),
          ),
        }),
      ),
      projects: z.array(
        z.object({
          id: nonEmpty,
          image: optionalText,
          gallery: z.array(z.string()),
          liveUrl: optionalText,
          repositoryUrl: optionalText,
          caseStudyUrl: optionalText,
          featured: z.boolean(),
          translations: translatedRecord(
            z.object({
              title: nonEmpty,
              slug: optionalText,
              shortDescription: optionalText,
              description: optionalText,
              category: optionalText,
              role: optionalText,
              year: optionalText,
              technologies: z.array(z.string()),
            }),
          ),
        }),
      ),
      services: z.array(
        z.object({
          id: nonEmpty,
          translations: translatedRecord(
            z.object({ title: nonEmpty, description: optionalText, features: z.array(z.string()), cta: ctaSchema.optional() }),
          ),
        }),
      ),
      testimonials: z.array(
        z.object({
          id: nonEmpty,
          avatar: optionalText,
          translations: translatedRecord(
            z.object({ quote: nonEmpty, name: nonEmpty, role: optionalText, company: optionalText }),
          ),
        }),
      ),
    }),
  })
  .superRefine((content, ctx) => {
    const localeCodes = content.settings.locales.map((locale) => locale.code);
    if (new Set(localeCodes).size !== localeCodes.length) {
      ctx.addIssue({ code: "custom", path: ["settings", "locales"], message: "Locale codes must be unique" });
    }
    if (!localeCodes.includes(content.settings.defaultLocale)) {
      ctx.addIssue({ code: "custom", path: ["settings", "defaultLocale"], message: "Default locale must exist" });
    }
    for (const code of localeCodes) {
      if (!content.translations[code]) {
        ctx.addIssue({ code: "custom", path: ["translations", code], message: "Locale content is missing" });
      }
    }
    const ids = content.layout.sections.map((section) => section.id);
    if (ids.length !== sectionIds.length || new Set(ids).size !== sectionIds.length || sectionIds.some((id) => !ids.includes(id))) {
      ctx.addIssue({ code: "custom", path: ["layout", "sections"], message: "Every reorderable section must appear exactly once" });
    }
    for (const [collectionName, items] of Object.entries(content.collections)) {
      const itemIds = items.map((item) => item.id);
      if (new Set(itemIds).size !== itemIds.length) {
        ctx.addIssue({ code: "custom", path: ["collections", collectionName], message: "Item IDs must be unique" });
      }
    }
  });

export function formatValidationError(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join(".") || "content"}: ${issue.message}`).join("\n");
}
