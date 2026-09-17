import type { Service, ServiceTranslation } from "../../content/content.types";
import { SectionShell, TextLink } from "./SectionPrimitives";

export function ServicesSection({ items, heading }: { items: Array<{ entity: Service; content: ServiceTranslation }>; heading: string }) {
  return (
    <SectionShell id="services" title={heading}>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map(({ entity, content }) => (
          <article key={entity.id} className="portfolio-card border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-950">{content.title}</h3>
            {content.description ? <p className="mt-3 text-gray-600">{content.description}</p> : null}
            {content.features.length ? <ul className="mt-4 list-disc space-y-1 ps-5 text-sm text-gray-600">{content.features.map((item) => <li key={item}>{item}</li>)}</ul> : null}
            {content.cta ? <div className="mt-5"><TextLink href={content.cta.href}>{content.cta.label}</TextLink></div> : null}
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
