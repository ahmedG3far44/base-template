import type { CTA, ContactContent, FooterContent, HeaderContent, HeroContent, LocaleContent, SEOContent } from "../../content/content.types";
import { joinList, localeContent, splitList } from "../../content/content.utils";
import { usePortfolioContent } from "../../hooks/usePortfolioContent";
import { Checkbox, EditorSection, Field, Input, Textarea } from "./FormControls";
import { ImageDropField } from "./ImageDropField";
import { LinkListEditor } from "./LinkListEditor";

function useLocaleEditor<K extends keyof LocaleContent>(key: K) {
  const { content, activeLocale, updateContent } = usePortfolioContent();
  const value = localeContent(content, activeLocale)[key];
  const update = (next: LocaleContent[K]) => updateContent((draft) => { draft.translations[activeLocale]![key] = next; });
  return [value, update] as const;
}

function CTAEditor({ label, value, onChange }: { label: string; value?: CTA; onChange: (value: CTA | undefined) => void }) {
  const enabled = Boolean(value);
  return (
    <fieldset className="space-y-3 rounded-md border border-gray-200 p-3">
      <legend className="px-1 text-sm font-semibold text-gray-800">{label}</legend>
      <Checkbox label="Enabled" checked={enabled} onChange={(checked) => onChange(checked ? { label: "Call to action", href: "#contact" } : undefined)} />
      {value ? <><Input label="Label" value={value.label} onChange={(event) => onChange({ ...value, label: event.target.value })} /><Input label="URL or anchor" value={value.href} onChange={(event) => onChange({ ...value, href: event.target.value })} /></> : null}
    </fieldset>
  );
}

export function SEOEditor() {
  const { content, updateContent } = usePortfolioContent();
  const [value, update] = useLocaleEditor("seo");
  const patch = (next: Partial<SEOContent>) => update({ ...value, ...next });
  return (
    <EditorSection title="Page & SEO" defaultOpen>
      <Input label="Browser tab title" value={value.pageTitle} onChange={(event) => patch({ pageTitle: event.target.value })} />
      <div>
        <Textarea label="Meta description" maxLength={160} value={value.description} onChange={(event) => patch({ description: event.target.value })} />
        <p className="mt-1 text-right text-xs text-gray-500">{value.description.length}/160</p>
      </div>
      <Textarea label="Keywords" value={joinList(value.keywords)} onChange={(event) => patch({ keywords: splitList(event.target.value) })} placeholder="React, TypeScript, Full-stack developer" />
      <Input label="Author" value={value.author ?? ""} onChange={(event) => patch({ author: event.target.value })} />
      <Input label="Social sharing title" value={value.socialTitle ?? ""} onChange={(event) => patch({ socialTitle: event.target.value })} />
      <div>
        <Textarea label="Social sharing description" maxLength={160} value={value.socialDescription ?? ""} onChange={(event) => patch({ socialDescription: event.target.value })} />
        <p className="mt-1 text-right text-xs text-gray-500">{(value.socialDescription ?? "").length}/160</p>
      </div>
      <ImageDropField label="Browser tab icon" value={content.media.favicon ?? ""} fileNameBase="favicon" defaultRadius={8} showRadiusControl={false} onChange={(favicon) => updateContent((draft) => { draft.media.favicon = favicon; })} />
    </EditorSection>
  );
}

export function HeaderEditor() {
  const [value, update] = useLocaleEditor("header");
  const patch = (next: Partial<HeaderContent>) => update({ ...value, ...next });
  return (
    <EditorSection title="Header">
      <Input label="Name" value={value.name} onChange={(event) => patch({ name: event.target.value })} />
      <Input label="Logo text" value={value.logoText} onChange={(event) => patch({ logoText: event.target.value })} />
      <Checkbox label="Show portfolio language selector" checked={value.showLanguageSwitcher} onChange={(showLanguageSwitcher) => patch({ showLanguageSwitcher })} />
      <CTAEditor label="Header CTA" value={value.cta} onChange={(cta) => patch({ cta })} />
      <LinkListEditor label="Navigation" value={value.navigation} onChange={(navigation) => patch({ navigation })} />
      <LinkListEditor label="Social links" value={value.socialLinks} onChange={(socialLinks) => patch({ socialLinks })} />
    </EditorSection>
  );
}

export function HeroEditor() {
  const { content, updateContent } = usePortfolioContent();
  const [value, update] = useLocaleEditor("hero");
  const patch = (next: Partial<HeroContent>) => update({ ...value, ...next });
  return (
    <EditorSection title="Hero">
      <Input label="Eyebrow" value={value.eyebrow ?? ""} onChange={(event) => patch({ eyebrow: event.target.value })} />
      <Input label="Title" value={value.title} onChange={(event) => patch({ title: event.target.value })} />
      <Input label="Subtitle" value={value.subtitle ?? ""} onChange={(event) => patch({ subtitle: event.target.value })} />
      <Textarea label="Description" value={value.description ?? ""} onChange={(event) => patch({ description: event.target.value })} />
      <Input label="Availability" value={value.availability ?? ""} onChange={(event) => patch({ availability: event.target.value })} />
      <Input label="Location" value={value.location ?? ""} onChange={(event) => patch({ location: event.target.value })} />
      <ImageDropField label="Hero image" value={content.media.heroImage ?? ""} fileNameBase="hero" defaultRadius={16} onChange={(heroImage) => updateContent((draft) => { draft.media.heroImage = heroImage; })} />
      <CTAEditor label="Primary CTA" value={value.primaryCTA} onChange={(primaryCTA) => patch({ primaryCTA })} />
      <CTAEditor label="Secondary CTA" value={value.secondaryCTA} onChange={(secondaryCTA) => patch({ secondaryCTA })} />
    </EditorSection>
  );
}

export function ContactEditor() {
  const [value, update] = useLocaleEditor("contact");
  const patch = (next: Partial<ContactContent>) => update({ ...value, ...next });
  return (
    <EditorSection title="Contact">
      <Input label="Heading" value={value.heading} onChange={(event) => patch({ heading: event.target.value })} />
      <Textarea label="Description" value={value.description ?? ""} onChange={(event) => patch({ description: event.target.value })} />
      <Input label="Email" type="email" value={value.email ?? ""} onChange={(event) => patch({ email: event.target.value })} />
      <Input label="Phone" value={value.phone ?? ""} onChange={(event) => patch({ phone: event.target.value })} />
      <Input label="Location" value={value.location ?? ""} onChange={(event) => patch({ location: event.target.value })} />
      <CTAEditor label="Contact CTA" value={value.cta} onChange={(cta) => patch({ cta })} />
      <LinkListEditor label="Contact links" value={value.contactLinks} onChange={(contactLinks) => patch({ contactLinks })} />
      <LinkListEditor label="Social links" value={value.socialLinks} onChange={(socialLinks) => patch({ socialLinks })} />
    </EditorSection>
  );
}

export function FooterEditor() {
  const [value, update] = useLocaleEditor("footer");
  const patch = (next: Partial<FooterContent>) => update({ ...value, ...next });
  return (
    <EditorSection title="Footer">
      <Input label="Name" value={value.name} onChange={(event) => patch({ name: event.target.value })} />
      <Textarea label="Short description" value={value.description ?? ""} onChange={(event) => patch({ description: event.target.value })} />
      <Input label="Copyright" value={value.copyright} onChange={(event) => patch({ copyright: event.target.value })} />
      <LinkListEditor label="Navigation" value={value.navigation} onChange={(navigation) => patch({ navigation })} />
      <LinkListEditor label="Social links" value={value.socialLinks} onChange={(socialLinks) => patch({ socialLinks })} />
      <LinkListEditor label="Additional links" value={value.additionalLinks} onChange={(additionalLinks) => patch({ additionalLinks })} />
    </EditorSection>
  );
}

export function PageLabelsEditor() {
  const [headings, updateHeadings] = useLocaleEditor("sectionHeadings");
  const [labels, updateLabels] = useLocaleEditor("labels");
  return (
    <EditorSection title="Section headings & labels">
      <Input label="Experience heading" value={headings.experiences} onChange={(event) => updateHeadings({ ...headings, experiences: event.target.value })} />
      <Input label="Skills heading" value={headings.skills} onChange={(event) => updateHeadings({ ...headings, skills: event.target.value })} />
      <Input label="Projects heading" value={headings.projects} onChange={(event) => updateHeadings({ ...headings, projects: event.target.value })} />
      <Input label="Services heading" value={headings.services} onChange={(event) => updateHeadings({ ...headings, services: event.target.value })} />
      <Input label="Testimonials heading" value={headings.testimonials} onChange={(event) => updateHeadings({ ...headings, testimonials: event.target.value })} />
      <Input label="Current role label" value={labels.present} onChange={(event) => updateLabels({ ...labels, present: event.target.value })} />
      <Input label="Skill fallback label" value={labels.skill} onChange={(event) => updateLabels({ ...labels, skill: event.target.value })} />
      <Input label="Live site label" value={labels.liveSite} onChange={(event) => updateLabels({ ...labels, liveSite: event.target.value })} />
      <Input label="Repository label" value={labels.repository} onChange={(event) => updateLabels({ ...labels, repository: event.target.value })} />
      <Input label="Case study label" value={labels.caseStudy} onChange={(event) => updateLabels({ ...labels, caseStudy: event.target.value })} />
      <Input label="Image placeholder label" value={labels.imagePlaceholder} onChange={(event) => updateLabels({ ...labels, imagePlaceholder: event.target.value })} />
      <Input label="View project details label" value={labels.viewDetails} onChange={(event) => updateLabels({ ...labels, viewDetails: event.target.value })} />
      <Input label="Close label" value={labels.close} onChange={(event) => updateLabels({ ...labels, close: event.target.value })} />
      <Input label="Project details label" value={labels.projectDetails} onChange={(event) => updateLabels({ ...labels, projectDetails: event.target.value })} />
      <Input label="Category label" value={labels.category} onChange={(event) => updateLabels({ ...labels, category: event.target.value })} />
      <Input label="Technologies label" value={labels.technologies} onChange={(event) => updateLabels({ ...labels, technologies: event.target.value })} />
      <Input label="Role label" value={labels.role} onChange={(event) => updateLabels({ ...labels, role: event.target.value })} />
      <Input label="Year label" value={labels.year} onChange={(event) => updateLabels({ ...labels, year: event.target.value })} />
      <Input label="Gallery label" value={labels.gallery} onChange={(event) => updateLabels({ ...labels, gallery: event.target.value })} />
    </EditorSection>
  );
}

export function ContentEditors() {
  return <><SEOEditor /><HeaderEditor /><HeroEditor /><PageLabelsEditor /><ContactEditor /><FooterEditor /></>;
}
