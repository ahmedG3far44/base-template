import type { Testimonial, TestimonialTranslation } from "../../content/content.types";
import { ContentImage, SectionShell } from "./SectionPrimitives";

export function TestimonialsSection({ items, heading }: { items: Array<{ entity: Testimonial; content: TestimonialTranslation; imageRadius: number }>; heading: string }) {
  return (
    <SectionShell id="testimonials" title={heading}>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map(({ entity, content, imageRadius }) => (
          <figure key={entity.id} className="portfolio-card border border-gray-200 bg-white p-6">
            <ContentImage key={entity.avatar || entity.id} src={entity.avatar} alt="" className="mb-4 size-12 bg-gray-100 object-cover" radius={imageRadius} showPlaceholder={false} />
            <blockquote className="leading-7 text-gray-700">“{content.quote}”</blockquote>
            <figcaption className="mt-5 text-sm"><strong className="text-gray-950">{content.name}</strong><span className="text-gray-500">{[content.role, content.company].filter(Boolean).length ? ` · ${[content.role, content.company].filter(Boolean).join(", ")}` : ""}</span></figcaption>
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
