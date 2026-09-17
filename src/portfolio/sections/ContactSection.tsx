import type { ContactContent } from "../../content/content.types";
import { SectionShell, TextLink } from "./SectionPrimitives";

export function ContactSection({ content }: { content: ContactContent }) {
  return (
    <SectionShell id="contact" title={content.heading}>
      {content.description ? <p className="max-w-2xl leading-7 text-gray-600">{content.description}</p> : null}
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
        {content.email ? <a href={`mailto:${content.email}`}>{content.email}</a> : null}
        {content.phone ? <a href={`tel:${content.phone}`}>{content.phone}</a> : null}
        {content.location ? <span>{content.location}</span> : null}
        {[...content.contactLinks, ...content.socialLinks].map((item) => <a key={item.id} href={item.href}>{item.label}</a>)}
      </div>
      {content.cta ? <div className="mt-6"><TextLink href={content.cta.href}>{content.cta.label}</TextLink></div> : null}
    </SectionShell>
  );
}
